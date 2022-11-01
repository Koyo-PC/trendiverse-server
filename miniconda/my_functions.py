from typing import List, Tuple
import numpy as np
from datetime import datetime, timedelta
import pickle
from bisect import bisect

nparray = np.ndarray


# 追跡が終わったoriginal_idのnumpy配列を返す
def get_tracked_id() -> nparray:
    tracked_id: List[int]
    with open("dumped_data/cut_fivemin_tracked_id_Oct31.bin", "rb") as p:
        tracked_id = pickle.load(p)
    return tracked_id


# 追跡が終わったトレンドのhotnessを返す
def get_tracked_hotness() -> List[nparray]:
    hotness: List[nparray]
    with open("dumped_data/cut_fivemin_hotness_Oct31.bin", "rb") as p:
        hotness = pickle.load(p)
    return hotness


# 1次元nparrayを正規化
def normalize_array(array: nparray) -> nparray:
    maximum = np.max(array)
    return array / maximum


# 2次元nparrayを正規化
def normalize_hotness(array: nparray):
    maximum = np.max(array, axis=1)
    return array / maximum[:, np.newaxis]


# 使えるデータのidと使えるデータを返す(oldsはoriginal_hotnessを想定)
def get_usable(new: nparray, olds: List[nparray]) -> Tuple[List[int], nparray]:
    current_time = new.size
    usable_id = list()
    for i in range(len(olds)):
        if olds[i].size >= current_time:
            usable_id.append(i)
    if len(usable_id) == 0:
        return usable_id, np.array([0])
    usable_data = np.zeros((len(usable_id), current_time))
    for i in range(len(usable_id)):
        usable_data[i] = olds[usable_id[i]][:current_time]
    return usable_id, usable_data


# 最も近いグラフと誤差を返す
def get_nearest(new: nparray, usable_olds: nparray) -> Tuple[int, float]:
    # 1次元配列と2次元配列のRMSEを返す
    def RMSE(X: nparray, olds: nparray) -> nparray:
        return np.sqrt(((X - olds) ** 2).mean(axis=1))

    errors = RMSE(normalize_array(new), normalize_hotness(usable_olds))
    smallest_error_id = np.argmin(errors)
    return smallest_error_id, errors[smallest_error_id]


# 標準の日付表記に直す
def convert_datetime(date: str):
    return datetime.strptime(date[0:4] + "-" + date[5:7] + "-" + date[8:10] + " " + date[11:16], "%Y-%m-%d %H:%M")

def convert_datetime_for_dumped(date: str):
    return datetime.strptime(date, "%Y-%m-%d %H:%M:%S")

# 全部5分間隔にする
def make_diff_five(date: List[datetime], hotness: nparray) -> Tuple[List[datetime], nparray]:
    if len(date) == 1:
        return  [date[0] + timedelta(minutes=5 - (date[0].minute % 5))], hotness

    def get_timedelta_by_minute(datetime0: datetime, datetime1: datetime) -> int:
        return int((datetime1 - datetime0).total_seconds() / 60)

    start_time: datetime = date[0] + timedelta(minutes=5 - (date[0].minute % 5))
    end_time: datetime = date[-1] - timedelta(minutes=date[-1].minute % 5)

    # new_dateの作成
    n: int = int(get_timedelta_by_minute(start_time, end_time) / 5) + 1
    new_date: List[datetime] = list(range(n))
    for i in range(n):
        new_date[i] = start_time + timedelta(minutes=5 * i)

    # new_hotnessの作成
    def divide_internally(hotness_left: int, hotness_right: int, datetime_left: datetime, datetime_right: datetime, target):
        p = get_timedelta_by_minute(datetime_left, target)
        q = get_timedelta_by_minute(target, datetime_right)
        return (q * hotness_left + p * hotness_right) / (p + q)

    new_hotness: nparray = np.zeros((n,))
    for i in range(n):
        if new_date[i] in date:
            new_hotness[i] = hotness[date.index(new_date[i])]
        else:
            index = bisect(date, new_date[i])
            new_hotness[i] = divide_internally(hotness[index-1], hotness[index], date[index-1], date[index], new_date[i])

    return new_date, new_hotness
