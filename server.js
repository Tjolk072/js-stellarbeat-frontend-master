const express = require("express");
const app = express();
const history = require("connect-history-api-fallback");

let port = process.env.PORT || 3000;

app.use(
  history({
    rewrites: [
      { from: /\/faq$/, to: "/faq.html" },
      { from: /\/api$/, to: "/api.html" },
      { from: /\/terms-and-conditions$/, to: "/terms-and-conditions.html" },
    ],
  })
);
let cacheTime = 86400000 * 7; //7 day cache for assets
app.use(function (req, res, next) {
  res.setHeader("X-Frame-Options", "DENY"); //https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  //res.setHeader('Content-Security-Policy', 'default-src \'self\' *.stellarbeat.io');//https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  res.setHeader("X-XSS-Protection", "1"); //https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (
    req.url.match(/^\/(css|js|img|fonts)\/.+/) ||
    req.url.match(/^\/favicon.ico$/) ||
    req.url.match(/^\/.*\.worker.js$/)
  ) {
    res.setHeader("Cache-Control", "public, max-age=" + cacheTime); // cache header
  }
  next();
});

app.use(["/schemas/*.json"], function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow cors access
  next();
});

app.use(express.static("dist-client"));

app.listen(port, () => console.log("app listening on port: " + port));
