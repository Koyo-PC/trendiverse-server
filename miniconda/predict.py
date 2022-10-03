# docker compose up miniconda

import datetime
import time
from typing import List, Tuple, Dict
import numpy as np
import pandas as pd
import requests
import json
from my_functions import nparray, get_tracked_id, get_tracked_hotness, normalize_array, normalize_hotness, get_usable, get_nearest, convert_datetime
import plotly.graph_objects as go
import pickle


def predict(trend_id: int) -> Tuple[int, Dict[datetime.datetime, np.float64]]:
    # 入力データを生成
    r = requests.get(f"http://138.2.55.39:8081/getDataById?id={trend_id}")
    df = pd.DataFrame(json.loads(r.text)["list"])
    df["date"] = df["date"].map(convert_datetime)
    X = np.array(df["hotness"]).astype(np.float64)
    start_time = df["date"][0]

    # 最も似ているグラフのidと誤差を得る
    tracked_id: nparray = get_tracked_id()
    original_hotness: List[nparray] = get_tracked_hotness()
    usable_id: nparray
    usable_hotness: nparray
    usable_id, usable_hotness = get_usable(X, original_hotness)
    if len(usable_id) == 0:
        print("No prediction")
        return -1, dict()
    nearest_id: int
    error: float
    nearest_id, error = get_nearest(X, usable_hotness)
    # usable id の中でのindexになってるから直すーーー
    nearest_id = usable_id[nearest_id]
    print("==== have chosen the nearest graph ====")

    # 予測グラフを作成
    prediction = np.zeros((original_hotness[nearest_id].size,))
    current_time = X.size
    prediction[:current_time] = X
    prediction[current_time:] = original_hotness[nearest_id][current_time:]
    print(X.shape)
    print(original_hotness[nearest_id].shape)
    scale = (X.sum()) / (original_hotness[nearest_id][:current_time].sum())
    prediction[current_time:] = ((prediction[current_time:] * scale) + prediction[current_time-1]) / 2
    print("==== have predicted all hotness ====")

    # 各項目出力
    print(f"the nearest trend id: {tracked_id[nearest_id]}")
    print(f"error: {error}")
    date: pd.Series
    with open("dumped_data/dates_Oct1.bin", "rb") as p:
        date = pd.Series(pickle.load(p)[nearest_id]).map(convert_datetime)
    timedelta = start_time - date[0]
    date = date + timedelta + datetime.timedelta(hours=9)
    print(f"contained datetime: {date[date.size-1]}")

    # 計算結果があってるかの確認用
    # fig = go.Figure()
    # fig.add_trace(go.Scatter(x=date, y=prediction, line={'color': '#87cefa'}, name="prediction"))
    # fig.add_trace(go.Scatter(x=date, y=X, line={'color': '#90ee90'}, name="so far"))
    # fig.add_trace(go.Scatter(x=date, y=original_hotness[nearest_id], line={'color': '#00008B'}, name="original"))
    # fig.write_html("figures/prediction.html")

    predicted_graph = dict(zip(date.astype(str).values, prediction.tolist()))
    return tracked_id[nearest_id], predicted_graph


if __name__ == '__main__':
    launch = time.time()
    print(predict(2741))
    end = time.time()
    print(end - launch)
