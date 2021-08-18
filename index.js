/** @format */

const express = require("express");
const morgan = require("morgan");
const {createProxyMiddleware} = require("http-proxy-middleware");
const cors = require('cors')

const app = express();
const port = 5000;

// app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get('/sapi', (req, res) => {
//   res.send('Hello World!')
// })
app.use(cors())
app.use(
  "/*api",
  createProxyMiddleware({
    target: "https://api.binance.com",
    changeOrigin: true,
    logLevel: "debug",
    secure: false,
    onProxyRes: (proxyRes, req, res) => {
      const exchange = `[${req.method}] [${proxyRes.statusCode}] ${req.path} -> ${proxyRes.req.protocol}//${proxyRes.req.host}${proxyRes.req.path}`;
      console.log(exchange); // [GET] [200] / -> http://www.example.com
    },
    onProxyReq: (proxyReq, req, res) =>{
      console.log('api key ' + proxyReq.getHeader('X-MBX-APIKEY'));
    },
    onError: function onError(err, req, res) {
      console.error(err);
      res.status(500);
      res.json({error: "Error when connecting to remote server."});
    },
  })
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
