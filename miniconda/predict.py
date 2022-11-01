import datetime
from typing import List, Tuple, Dict
import numpy as np
import pandas as pd
import requests
import json
from my_functions import nparray, get_tracked_id, get_tracked_hotness, normalize_array, normalize_hotness, get_usable, get_nearest, convert_datetime, convert_datetime_for_dumped,make_diff_five
import plotly.graph_objects as go
from copy import deepcopy
import pickle
import sys
import urllib.parse
from http.server import BaseHTTPRequestHandler
from http.server import ThreadingHTTPServer
from http import HTTPStatus
import time
from multiprocessing import Pool

PORT = 8000


def predict(trend_id: int) -> Tuple[int, Dict[str, int]]:
    print(f"====== predicting {trend_id} ======")
    # 入力データを生成
    r = requests.get(f"http://172.30.0.10:8081/getDividedDataById?id={trend_id}")
    part_list = json.loads(r.text)["list"]
    df = pd.DataFrame(part_list[-1])
    df["date"] = df["date"].map(convert_datetime)
    X_date: List[datetime]
    X: nparray
    X_date, X = make_diff_five(df["date"].tolist(), np.array(df["hotness"]).astype(np.float64))
    start_time = X_date[0]

    # 最も似ているグラフのidと誤差を得る
    tracked_id: nparray = get_tracked_id()
    original_hotness: List[nparray] = get_tracked_hotness()
    usable_id: nparray
    usable_hotness: nparray
    usable_id, usable_hotness = get_usable(X, original_hotness)

    is_too_long = False
    if len(usable_id) == 0:
        is_too_long = True
        X_copy = deepcopy(X)
        X = X_copy[-1000:]
        usable_id, usable_hotness = get_usable(X, original_hotness)

    nearest_id: int
    error: float
    nearest_id, error = get_nearest(X, usable_hotness)
    # usable id の中でのindexになってるから直すーーー
    nearest_id = usable_id[nearest_id]
    print("==== have chosen the nearest graph ====")

    # 予測hotnessを作成
    prediction = np.zeros((original_hotness[nearest_id].size,))
    current_time = X.size
    prediction[:current_time] = X
    prediction[current_time:] = original_hotness[nearest_id][current_time:]
    scale = (X.sum()) / (original_hotness[nearest_id][:current_time].sum())
    prediction[current_time:] = ((prediction[current_time:] * scale) + prediction[current_time-1]) / 2
    if is_too_long:
        prediction = np.hstack((X_copy, prediction[1000:]))
        print(prediction.size)

    print("==== have predicted all hotness ====")

    # 各項目出力
    print(f"the nearest trend id: {tracked_id[nearest_id]}")
    print(f"error: {error}")

    date: pd.Series
    with open("dumped_data/cut_fivemin_dates_Oct31.bin", "rb") as p:
        date = pd.Series(pickle.load(p)[nearest_id])
    date = date.map(convert_datetime_for_dumped)

    if is_too_long:
        prediction_date = list(range(prediction.size))
        prediction_date[:len(X_date)] = X_date
        timedelta = X_date[-1] - date[999]
        prediction_date[len(X_date):] = (pd.Series(date[1000:]) + timedelta).to_list()
        prediction_date = (pd.Series(prediction_date) + datetime.timedelta(hours=9)).to_list()
    else:
        timedelta = start_time - date[0]
        prediction_date = (date + timedelta + datetime.timedelta(hours=9)).to_list()
    print(f"contained datetime: {prediction_date[len(prediction_date) - 1]}")

    prediction = prediction.astype(int)

    # 計算結果があってるかの確認用
    # fig = go.Figure()
    # fig.add_trace(go.Scatter(x=prediction_date, y=prediction, line={'color': '#87cefa'}, name="prediction"))
    # fig.add_trace(go.Scatter(x=prediction_date, y=X_copy if is_too_long else X, line={'color': '#90ee90'}, name="so far"))
    # fig.add_trace(go.Scatter(x=prediction_date, y=original_hotness[nearest_id], line={'color': '#00008B'}, name="original"))
    # fig.write_html("figures/prediction.html")

    predicted_graph: List[List[Dict[str, int]]] = list(range(len(part_list)))
    if len(part_list) == 1:
        predicted_graph[0] = pd.DataFrame(np.array([pd.Series(prediction_date).map(str).to_list(), prediction.tolist()]).T, columns=["date", "hotness"]).to_dict("records")
    else:
        for i in range(len(part_list)):
            each_df = pd.DataFrame(part_list[i])
            each_date = each_df["date"].map(convert_datetime).tolist()
            each_hotness = np.array(each_df["hotness"])
            each_date, each_hotness = make_diff_five(each_date, each_hotness)
            predicted_graph[i] = pd.DataFrame(np.array([pd.Series(each_date).map(str).to_list(), each_hotness.tolist()]).T, columns=["date", "hotness"]).to_dict("records")

    return tracked_id[nearest_id], predicted_graph

def writeData(id):
    result = predict(id)
    encoded = '{"id": ' + str(result[0]) + ', "data": ' + str(result[1]) + '}'
    with open("/ai_share/" + str(id) + ".json", mode='w') as f:
        f.write(encoded)

if __name__ == '__main__':
    while True:
        start = time.time()
        ids = []

        req_tracking = requests.get(f"http://172.30.0.10:8081/showTracking")
        df_tracking = pd.DataFrame(json.loads(req_tracking.text)["list"])
        for index, data in df_tracking.iterrows():
            ids.append(int(data["id"]))
        req_trend = requests.get(f"http://172.30.0.10:8081/showTrend")
        df_trend = pd.DataFrame(json.loads(req_trend.text)["list"])
        for index, data in df_trend.iterrows():
            if int(data["id"]) in ids:
                ids.append(int(data["id"]))
        p = Pool(3)
        p.map(writeData, ids)
        print("time = " + str(time.time() - start), flush=True)
        time.sleep(max(0, 300 - (time.time() - start)))