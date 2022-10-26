import datetime
from typing import List, Tuple, Dict
import numpy as np
import pandas as pd
import requests
import json
from my_functions import nparray, get_tracked_id, get_tracked_hotness, normalize_array, normalize_hotness, get_usable, get_nearest, convert_datetime, make_diff_five
import plotly.graph_objects as go
import pickle
import sys
import urllib.parse
from http.server import BaseHTTPRequestHandler
from http.server import HTTPServer
from http import HTTPStatus

PORT = 8000


class StubHttpRequestHandler(BaseHTTPRequestHandler):
    server_version = "HTTP Stub/0.1"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def do_GET(self):
        enc = sys.getfilesystemencoding()

        o = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(o.query)

        result = predict(int(query["id"][0]))
        encoded = ('{"id": ' + str(result[0]) + ', "data": ' + str(pd.DataFrame({"date": result[1].keys(), "hotness": result[1].values()}).to_json(orient="records")) + '}').encode(enc, 'suurogateescape')

        self.send_response(HTTPStatus.OK)
        self.send_header("Content-type", "text/plain; charset=%s" % enc)
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()

        self.wfile.write(encoded)


def predict(trend_id: int) -> Tuple[int, Dict[datetime.datetime, np.float64]]:
    # 入力データを生成
    r = requests.get(f"http://172.30.0.10:8081/getDataById?id={trend_id}")
    df = pd.DataFrame(json.loads(r.text)["list"])
    df["date"] = df["date"].map(convert_datetime)
    X: nparray
    X_date, X = make_diff_five(df["date"].tolist(), np.array(df["hotness"]).astype(np.float64))
    start_time = X_date[0]

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

    # 予測hotnessを作成
    prediction = np.zeros((original_hotness[nearest_id].size,))
    current_time = X.size
    prediction[:current_time] = X
    prediction[current_time:] = original_hotness[nearest_id][current_time:]
    scale = (X.sum()) / (original_hotness[nearest_id][:current_time].sum())
    prediction[current_time:] = ((prediction[current_time:] * scale) + prediction[current_time-1]) / 2
    print("==== have predicted all hotness ====")

    # 各項目出力
    print(f"the nearest trend id: {tracked_id[nearest_id]}")
    print(f"error: {error}")

    date: pd.Series
    with open("dumped_data/fivemin_edited_dates_Oct22.bin", "rb") as p:
        date = pd.Series(pickle.load(p)[nearest_id])
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
    handler = StubHttpRequestHandler
    httpd = HTTPServer(('', PORT), handler)
    httpd.serve_forever()
