export function onListRequest(last_request) {
    return JSON.stringify({
        "google": [
            "Trend_01",
            "Trend_02",
            "Trend_03",
            "Trend_04",
        ],
        "twitter": [
            "Trend_01",
            "Trend_02",
            "Trend_001",
            "Trend_002",
        ]
    });
}