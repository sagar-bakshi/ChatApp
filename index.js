const express = require('express');

//app setup

const app = express();
const server = app.listen(4000,function () {
    console.log('server is running on port 4000');
})

//static files

app.use(express.static('public'));

