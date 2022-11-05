import datetime
from typing import List, Tuple, Dict
import numpy as np
import pandas as pd
import requests
import json
from my_functions import nparray, get_tracked_id, get_tracked_hotness, normalize_array, normalize_hotness, get_usable, get_nearest, convert_datetime, make_diff_five
import plotly.graph_objects as go
from copy import deepcopy
import pickle
import sys
import urllib.parse
from http.server import BaseHTTPRequestHandler
from http.server import ThreadingHTTPServer
from http import HTTPStatus
import os

PORT = 8000


class StubHttpRequestHandler(BaseHTTPRequestHandler):
    server_version = "HTTP Stub/0.1"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def do_GET(self):
        enc = sys.getfilesystemencoding()

        o = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(o.query)

        id = int(query["id"][0])

        str_result = ""
        if os.path.isfile("/ai_share/" + str(id) + ".json"):
            with open("/ai_share/" + str(id) + ".json", mode='r') as f:
                str_result = f.read()
        else:
            result = getData(id)
            if result is None:
                encoded = "Trend Not Found".encode(enc, 'suurogateescape')
                self.send_response(HTTPStatus.NOT_FOUND)
                self.send_header("Content-type", "text/plain; charset=%s" % enc)
                self.send_header("Content-Length", str(len(encoded)))
                self.end_headers()
                self.wfile.write(encoded)
                return
            str_result ='{"id": ' + str(result[0]) + ', "data": ' + str(result[1]) + '}'
        encoded = str_result.encode(enc, 'suurogateescape')

        self.send_response(HTTPStatus.OK)
        self.send_header("Content-type", "application/json; charset=%s" % enc)
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()

        self.wfile.write(encoded)



def getData(trend_id: int) -> Tuple[int, Dict[str, int]] | None:
    r = requests.get(f"http://172.30.0.10:8081/getDividedDataById?id={trend_id}")
    part_list = json.loads(r.text)["list"]
    parts = len(part_list)
    if parts == 0:
        return None
    ret: List[List[Dict[str, int]]] = list(range(parts))
    for i in range(parts):
        df = pd.DataFrame(part_list[i])
        date = df["date"].map(convert_datetime).tolist()
        hotness = np.array(df["hotness"]).astype("float")
        if len(date) == 0:
            return None
        date, hotness = make_diff_five(date, hotness)
        ret[i] = pd.DataFrame(np.array([pd.Series(date).map(str).to_list(), hotness.tolist()]).T, columns=["date", "hotness"]).to_dict("records")
    if len(ret) == 0:
        return None
    return trend_id, ret

if __name__ == '__main__':
    handler = StubHttpRequestHandler
    httpd = ThreadingHTTPServer(('', PORT), handler)
    httpd.serve_forever()
