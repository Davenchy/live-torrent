const express = require('express');

require('dotenv').config();

const { PORT } = process.env;
const app = express();

app.get('/', (req, res) => res.send('ok!'));

if (!PORT) throw new Error('PORT env var is not defined');
app.listen(PORT, () => console.log('app is running on port ' + PORT))
