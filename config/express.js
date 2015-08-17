'use strict';

/**
 * Module dependencies.
 */
var http = require('http'),
    https = require('https'),
    socketio = require('socket.io'),
    express = require('express'),
    morgan = require('morgan'),
    logger = require('./logger'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compression = require('compression'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    passport = require('passport'),
    MongoStore = require('connect-mongo')({
        session: session
    }),
    flash = require('connect-flash'),
    config = require('./config'),
    consolidate = require('consolidate'),
    path = require('path');

module.exports = function(db) {
    // Initialize express app
    var app = express();

    // Create a new HTTP server
    var server = http.createServer(app);

    // Create a new Socket.io server
    var io = socketio.listen(server);

    // Globbing model files
    config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
        require(path.resolve(modelPath));
    });

    // Setting application local variables
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    app.locals.jsFiles = config.getJavaScriptAssets();
    app.locals.cssFiles = config.getCSSAssets();

    // Should be placed before express.static
    app.use(compression({
        // only compress files for the following content types
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        // zlib option for compression level
        level: 3
    }));

    // Showing stack errors
    app.set('showStackError', true);

    // Set swig as the template engine
    app.engine('server.view.html', consolidate[config.templateEngine]);

    // Set views path and view engine
    app.set('view engine', 'server.view.html');
    app.set('views', './app/views');

    // Enable logger (morgan)
    app.use(morgan(logger.getLogFormat(), logger.getLogOptions()));

    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
        // Disable views cache
        app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Use helmet to secure Express headers
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.disable('x-powered-by');

    // Setting the app router and static folder
    app.use(express.static(path.resolve('./public')));
	app.use('/uploads', express.static('./uploads'));

    // CookieParser should be above session
    app.use(cookieParser());

    var mongoStore = new MongoStore({
            mongooseConnection: db,
            collection: config.sessionCollection
    });

    // Express MongoDB session storage
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        store: mongoStore,
        cookie: config.sessionCookie,
        name: config.sessionName
    }));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // connect flash for flash messages
    app.use(flash());

    // Globbing routing files
    config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
        require(path.resolve(routePath))(app);
    });

    // Load the Socket.io configuration
    require('./socketio')(server, io, mongoStore);

    // Return Express server instance
    return server;
};
