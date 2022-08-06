const DB = require("../db/TrendiverseDB.js");

/**
 * This function involves a table named ${name}.
 * You can create such table by executing the command below.
 * 
 * create table trend1 (date timestamp default current_timestamp, hotness float);
 * 
 * @returns {string}
 */

module.exports =  function onInfoRequest(last_request, name) {
    return JSON.stringify({
        "category": "Test",
        "related": ["Trend_01"],
        "data": {
            "google": [
                {
                    "date": "2021-01-01 00:00:00",
                    "hotness": 10.2398
                },
                {
                    "date": "2020-01-01 00:05:00",
                    "hotness": 43.3498
                },
                {
                    "date": "2021-01-01 00:10:00",
                    "hotness": 83.8943
                }
            ],
            "twitter": [
                {
                    "date": "2021-01-01 00:00:10",
                    "hotness": 84.2398
                },
                {
                    "date": "2021-01-01 00:05:20",
                    "hotness": 15.3289
                },
                {
                    "date": "2021-01-01 00:10:30",
                    "hotness": 357.2398
                }
            ]
        },
    });
}