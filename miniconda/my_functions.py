from typing import List, Tuple
import numpy as np
from datetime import datetime
import pickle

nparray = np.ndarray


# 追跡が終わったoriginal_idのnumpy配列を返す
def get_tracked_id() -> nparray:
    tracked_id: List[int]
    with open("dumped_data/tracked-id.bin", "rb") as p:
        tracked_id = pickle.load(p)
    return tracked_id


# 追跡が終わったトレンドのhotnessを返す
def get_tracked_hotness() -> List[nparray]:
    hotness: List[nparray]
    with open("dumped_data/hotness_Oct1.bin", "rb") as p:
        hotness = pickle.load(p)
    return hotness


# 1次元nparrayを正規化
def normalize_array(array: nparray):
    maximum = np.max(array)
    array = array.astype(np.float64) / maximum
    return array


# 1次元nparrayのListのhotnessを正規化する
def normalize_hotness(array: List[nparray]) -> np.ndarray:
    for i in range(len(array)):
        array[i] = normalize_array(array[i])
    return array


# 使えるデータのidと使えるデータを返す(oldsはhotnessを想定)
def get_usable(new: nparray, olds: List[nparray]) -> Tuple[nparray, nparray]:
    current_time = new.size
    usable_id = list()
    for i in range(len(olds)):
        if olds[i].size >= current_time:
            usable_id.append(i)
    usable_data = np.zeros((len(usable_id), current_time))
    for i in range(len(usable_id)):
        usable_data[i] = olds[usable_id[i]][:current_time]
    return usable_id, usable_data


# 1次元配列と2次元配列のRMSEを返す
def RMSE(new: nparray, olds: nparray) -> nparray:
    return np.sqrt(((new - olds) ** 2).mean(axis=1))


# 最も近いグラフと誤差を返す
def get_nearest(new: nparray, usable_olds: nparray) -> Tuple[int, float]:
    errors = RMSE(new, usable_olds)
    smallest_error_id = np.argmin(errors)
    return smallest_error_id, errors[smallest_error_id]


# 標準の日付表記に直す
def convert_datetime(date: str):
    return datetime.strptime(date[0:4] + "-" + date[5:7] + "-" + date[8:10] + " " + date[11:16], "%Y-%m-%d %H:%M")
