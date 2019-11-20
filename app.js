"use strict";

var env = require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var session = require('express-session')

var Questionnaire = require('./models/questionnaire');

// Declare NMS
const NodeMediaServer = require('node-media-server');
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
}));

// Session handler
let sess = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {}
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

// Make the module sources available for frontend purposes
app.use(express.static(path.join(__dirname, '/node_modules/flv.js/dist/')));
app.use(express.static(path.join(__dirname, 'public')));

// Bind homepage to the indexrouter
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Create a global questionnaire
let q = new Questionnaire();
q.parseFileToJson('data/data.json');

// Parse the JSON to objects
q.parseJsonToQuestionList();
q.parseJsonToAnswerList();
q.parseJsonToTagList();

// make questionnaire global
app.set('questionnaire', q);

// Start mediaserver
const nmsConfig = {
    rtmp: {
        port: process.env.RTMP_PORT,
        chunk_size: process.env.RTMP_CHUNK_SIZE,
        gop_cache: true,
        ping: process.env.RTMP_PING,
        ping_timeout: 60
    },
    http: {
        port: process.env.HTTP_PORT,
        allow_origin: '*'
    }
};


global.rootDirectory = __dirname;


var nms = new NodeMediaServer(nmsConfig);
nms.run();

module.exports = app;