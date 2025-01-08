const express = require('express');
const path = require('path');
const pdfRoutes = require('./routes/pdfRoutes');
const ErrorHandler = require('./utils/errorHandler');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

app.use('/api', pdfRoutes);
app.use(ErrorHandler.handleError);

module.exports = app;