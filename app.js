const express = require('express');
const viewEngine = require('./helpers/view-engine');
const bodyParser = require('body-parser');

// setup env vars
require('dotenv').config();

const app = express();

// setup view engine
viewEngine(app);

// setup app static content
app.use(express.static('public'));

// setup middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// setup routes
app.use('/', require('./routes/main'));
app.use('/torrent', require('./routes/torrent'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('app is running on port ' + PORT))
