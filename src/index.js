const express = require('express');
const { PORT } = require('./constants');
const filesRouter = require('./routes/files');
const cors = require('cors');

const app = express();

app.use(cors());

app.use('/files', filesRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

module.exports = app;
