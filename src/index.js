require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passportConfig = require('./configs/passport');
const passport = require('passport');

const connection = require('./configs/database');
const router = require('./api/routes');
const { sendErr } = require('./api/helpers/response');
const ApiError = require('./api/helpers/error');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 8080;

const http = require('http');
const server = http.createServer(app);

const { configureSocket } = require('./api/services/socket');

// connect to mongodb
connection();

// // Enable CORS for all routes
// app.use((req, res, next) => {
//   console.log("handle cors");
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

// cors
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://react-final-jade.vercel.app',
    // "https://accounts.google.com/o/oauth2/v2/auth",
  ],
  //   origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));
// app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

// json parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// logger
app.use(morgan('dev'));

const io = configureSocket(server);

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <meta name="google-site-verification" content="WLfomxjNdO4j_lmqWa86FxURWBMiDQus3Fz8LBR1vaI" />
    </head>
    
    <body>
        <h1 style="text-align: center">Welcome React Final API</h1>
    </body>
    
    </html>`);
});

// routes
app.use('/api', router);

// handle server errors
app.use((err, req, res, next) => {
  const status = err.status ? err.status : 500;
  const message = err.message ? err.message : 'Internal Server Error';
  sendErr(res, {status, message});
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
