const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;
const host = '127.0.0.1';

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended: true}));

require('./routes/core.routes.js')(app);

app.listen(port, host, () => {
    console.log(`Listening to  http://${host}:${port}`);
});