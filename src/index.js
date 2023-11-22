require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const connection = require('./configs/database');
const router = require('./api/routes');
const { sendErr } = require('./api/helpers/response');
const ApiError = require('./api/helpers/error');

const app = express();
const port = process.env.PORT || 8080;

// connect to mongodb
connection();

// cors
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
};
app.use(cors(corsOptions));

// json parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// logger
app.use(morgan('dev'));

// routes
app.use('/api', router);

// handle server errors
app.use((err, req, res, next) => {
    const status = err.status ? err.status : 500;
    const message = err.message ? err.message : 'Internal Server Error';
    sendErr(res, new ApiError(status, message));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
