var express = require("express");
var serveStatic = require("serve-static");
const path = require('path')

var app = express();
app.use(serveStatic(__dirname + "/dist"));

app.all("*", (_, res) => {
    try {
        res.sendFile(path.join(__dirname, './dist/index.html'));
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: "Something went wrong" });
    }
});

var port = 5001;
app.listen(port);

console.log("serve statrted at " + port);
