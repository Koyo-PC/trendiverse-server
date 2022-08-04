export function onInfoRequest(last_request, name) {
    return JSON.stringify({
        "category": "Test",
        "related": ["Trend_01"]
    });
}