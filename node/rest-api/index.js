var express = require("express");

var app = express();
app.get("/list", (req, res) => {
    // last_request: yyyy-MM-dd-HH-mm-ss
    // example: /list?last_request=2022-01-01-00-00-00
    const last_request = req.params.last_request;
    if (last_request == undefined) {
        res.status(400).send("parameter 'last_request' is required.");
        return;
    }
    // TODO
    res.status(200).send(`
{
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
}`);
});
app.get("/data", (req, res) => {
    // last_request: yyyy-MM-dd-HH-mm-ss
    // name: String, URL-encoded
    // example: /info?name=Hoge&last_request=2022-01-01-00-00-00
    const last_request = req.params.last_request;
    const name = req.params.name;
    if (last_request == undefined) {
        res.status(400).send("parameter 'last_request' is required.");
        return;
    }
    if (name == undefined) {
        res.status(400).send("parameter 'name' is required.");
        return;
    }
    // TODO
    res.status(200).send(`
{
    "google": [
        {
            "date": 2021/01/01 00:00:00,
            "hotness": 10.2398
        },
        {
            "date": 2021/01/01 00:05:00,
            "hotness": 43.3498
        },
        {
            "date": 2021/01/01 00:10:00,
            "hotness": 83.8943
        }
    ],
    "twitter": [
        {
            "date": 2021/01/01 00:00:10,
            "hotness": 84.2398
        },
        {
            "date": 2021/01/01 00:05:20,
            "hotness": 15.3289
        },
        {
            "date": 2021/01/01 00:10:30,
            "hotness": 357.2398
        }
    ]
}`);
});
app.get("/info", (req, res) => {
    // last_request: yyyy-MM-dd-HH-mm-ss
    // name: String, URL-encoded
    // example: /info?name=Hoge&last_request=2022-01-01-00-00-00
    const last_request = req.params.last_request;
    const name = req.params.name;
    if (last_request == undefined) {
        res.status(400).send("parameter 'last_request' is required.");
        return;
    }
    if (name == undefined) {
        res.status(400).send("parameter 'name' is required.");
        return;
    }
    // TODO
    res.status(200).send(`
{
    "category": "Test",
    "related": ["Trend_01"]
}`);
});

app.listen(8080);