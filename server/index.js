const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.static('public'));
app.use(express.static('build'));
app.use(cors());
app.use(express.json());

app.use('/auth', require('./auth'))
app.use('/products', require('./products'))
app.use('/upload', require('./imagesRoute'))

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'), (err) => {
        if (err) {
            res.status(500).send("Not Found")
        }
    });
});
const PORT = process.env.PORT || 80

app.listen(PORT, console.log('server running'));

