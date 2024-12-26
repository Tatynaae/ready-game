const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const logger = require('./utils/logger');

const app = express();

app.use((req, res, next) => {
    logger.log(`Request Origin: ${req.get('Origin')}`);
    next();
});

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World!'
    });
});

module.exports = app;