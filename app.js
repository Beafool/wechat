const express = require('express');
const replay = require('./replay');
const app = express();




app.use( replay());

app.listen(3000, err => {
    if (!err) {
        console.log('服务器启动成功了~');
    } else {
        console.log(err);
    }
})