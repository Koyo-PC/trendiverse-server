export function onDataRequest(last_request, name) {
    return JSON.stringify({
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
    });
}