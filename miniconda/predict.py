# docker compose up miniconda

import datetime
from typing import List
import numpy as np
import pandas as pd
import json
from my_functions import nparray, get_tracked_id, get_tracked_hotness, normalize_array, normalize_hotness, get_usable, get_nearest, convert_datetime
import plotly.graph_objects as go
import requests


def predict(X: nparray, start_time: datetime.datetime):
    # 最も似ているグラフのidと誤差を得る
    tracked_id: nparray = get_tracked_id()
    original_hotness: List[nparray] = get_tracked_hotness()
    normalized_hotness: nparray = normalize_hotness(original_hotness)
    usable_id: nparray
    usable_hotness: nparray
    usable_id, usable_hotness = get_usable(X, normalized_hotness)
    nearest_id: int
    error: float
    nearest_id, error = get_nearest(X, usable_hotness)

    # 予測グラフを作成
    nearest_hotness = normalized_hotness[nearest_id]
    prediction = np.zeros((nearest_hotness.size,))
    current_time = X.size
    prediction[:current_time] = normalize_array(X)
    prediction[current_time:] = nearest_hotness[current_time:]

    # グラフを倍する
    scale = X.sum() / prediction[:current_time].sum()
    prediction *= scale

    # 各項目出力
    print(f"the nearest trend id: {tracked_id[nearest_id]}")
    print(f"error: {error}")
    fig = go.Figure()
    r = requests.get(f"http://138.2.55.39:8081/getDataById?id={tracked_id[nearest_id]}")
    date: pd.DataFrame = pd.DataFrame(json.loads(r.text)["list"])["date"].map(convert_datetime)
    timedelta = start_time - date[0]
    date = date + timedelta + datetime.timedelta(hours=9)

    print(f"contained datetime: {date[date.size-1]}")
    fig.add_trace(go.Scatter(x=date, y=prediction, line={'color': '#87cefa'}, name="prediction"))
    fig.add_trace(go.Scatter(x=date, y=X, line={'color': '#90ee90'}, name="so far"))
    fig.write_image("figures/prediction.svg")


if __name__ == '__main__':
    new_hotness = np.array(
        [1117, 1123, 1124, 1123, 1123, 1122, 1122, ]
    )
    predict(new_hotness, start_time=convert_datetime("2022-09-04T15:15:01.000Z"))
