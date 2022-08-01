var express = require("express");

var app = express();
app.get("/", (req, res) => {
    res.status(200).send("Express!!");
});

app.listen(8080);