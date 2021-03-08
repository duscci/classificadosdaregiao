
const _ = require("lodash");
const { parseString } = require("xml2js");
const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();

app.listen(3000, function () {
    console.log("Rodando...");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
})

app.get("/feed", async (req, res, next) => {
    const feed = await axios("https://www.classitudodiariodaregiao.com.br/rss.php");
    if (feed && feed.data) {
        parseString(feed.data, (err, json) => {
            if (err) return next();
            const result = json.rss.channel[0].item.map(v => {
                Object.keys(v).map(k => {
                    v[k] = v[k].toString()
                });
                return v
            });
            const group = _.groupBy(result, "section");
            return res.send(group);
        });
    } else {
        next();
    }
});