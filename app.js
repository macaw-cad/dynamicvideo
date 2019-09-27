var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var Questionnaire = require('./models/questionnaire');

// Declare OBS & NMS
const OBSWebSocket = require('obs-websocket-js');
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
app.use(express.static(path.join(__dirname, 'public')));

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
app.set('questionnaire', new Questionnaire());


// Start mediaserver
const nmsConfig = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 8000,
        allow_origin: '*'
    }
};

var nms = new NodeMediaServer(nmsConfig);
nms.run();

// Connect to OBS websocket
const obs = new OBSWebSocket();
let sceneList = [];

obs.connect({
    address: 'localhost:4444',
    password: ''
})
    .then(() => {
        console.log(`Success! We're connected & authenticated.`);

        obs.send('GetSceneList').then(function (sl) {
            for (id in sl.scenes) {
                sceneList.push(sl.scenes[id].name);
            }
        });
    });

app.set('obs', obs);
app.set('sceneList', sceneList);


module.exports = app;