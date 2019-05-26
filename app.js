const express = require('express');
const viewEngine = require('./helpers/view-engine');
const bodyParser = require('body-parser');

require('dotenv').config();

const { PORT } = process.env;
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

if (!PORT) throw new Error('PORT env var is not defined');
app.listen(PORT, () => console.log('app is running on port ' + PORT))
