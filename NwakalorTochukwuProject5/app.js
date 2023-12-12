// require modules
const express = require('express');
const morgan = require('morgan');
const eventRoutes = require('./routes/eventRoutes');
const methodOverride = require('method-override'); 
const mongoose = require('mongoose');
const {getCollection} = require("./models/event");
const MongoStore = require('connect-mongo');
const session = require('express-session');
const flash = require('connect-flash');
const userRoutes = require('./routes/userRoutes');
const mainRoutes = require('./routes/mainRoutes');

//create application
const app = express();

//configure application
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

//connect to database
mongoose.connect('mongodb+srv://tnwakalo:tochi1906@cluster0.twjs5e1.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    //start app
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));


//mount middlware 
app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb+srv://tnwakalo:tochi1906@cluster0.twjs5e1.mongodb.net/?retryWrites=true&w=majority'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//setup routes
app.get('/', (req, res)=>{
    res.render('index');
});

app.use('/events', eventRoutes);

app.use('/users', userRoutes);

app.use('/', mainRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);

});

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});


