const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('./dist/frontend'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/frontend/'}),
);

app.listen(process.env.PORT || 8080);
