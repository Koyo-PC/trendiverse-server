# docker compose up miniconda

import datetime
from typing import List, Tuple, Dict
import numpy as np
import pandas as pd
from my_functions import nparray, get_tracked_id, get_tracked_hotness, normalize_array, normalize_hotness, get_usable, get_nearest, convert_datetime
import plotly.graph_objects as go
import pickle


def predict(X: nparray, start_time: datetime.datetime) -> Tuple[int, Dict[datetime.datetime, np.float64]]:
    # 最も似ているグラフのidと誤差を得る
    tracked_id: nparray = get_tracked_id()
    original_hotness: List[nparray] = get_tracked_hotness()
    usable_id: nparray
    usable_hotness: nparray
    usable_id, usable_hotness = get_usable(X, original_hotness)
    nearest_id: int
    error: float
    nearest_id, error = get_nearest(X, usable_hotness)
    print("==== have chosen the nearest graph ====")

    # 予測グラフを作成
    nearest_hotness = normalize_array(original_hotness[nearest_id])
    prediction = np.zeros((nearest_hotness.size,))
    current_time = X.size
    prediction[:current_time] = X
    prediction[current_time:] = nearest_hotness[current_time:]
    scale = X.sum() / usable_hotness[nearest_id].sum()
    prediction[current_time:] = original_hotness[nearest_id][current_time:] * scale
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
    # fig.write_html("figures/prediction.html")

    predicted_graph = dict(zip(date.astype(str).values, prediction.tolist()))
    return tracked_id[nearest_id], predicted_graph


if __name__ == '__main__':
    # id2728
    new_hotness = np.array(
        [1117, 1123, 1124, 1123, 1123, 1122, 1122, ]
    )
    print(predict(new_hotness, start_time=convert_datetime("2022-09-04T15:15:01.000Z")))
