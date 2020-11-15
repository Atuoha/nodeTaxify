const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars')
const port = process.env.PORT || 5555;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const methodOverride = require('method-override')
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport');
// const eq = require('ember-truth-helpers')
const {mongoDburl} = require('./config/database')

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost:27017/nodeCms', {useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connect(mongoDburl, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(db=> console.log('Connected'))
    .catch(err=> console.log(err))

app.use(express.static(path.join(__dirname, 'public'))) // Loading Static files like css, js and stuffs


// custom select handlebars function
// const {select, generate_date, ifeq, paginate} = require('./helpers/handlebars-helpers')

// select: select, generate_date: generate_date, ifeq: ifeq, paginate: paginate

// --SETTING view engine using handlebars
app.engine('handlebars', handlebars(
    {
        defaultLayout: 'home',
        helpers:{},
        partialsDir: path.join(__dirname, "views/layouts/partials"),
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    
    }
    
))





// upload middleware
app.use(upload())

// setting view engine
app.set('view engine', 'handlebars')
// 


// Setting up bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// 


// Session Middleware
app.use(session({
    secret: 'tonyAtuoha',
    resave: true,
    saveUninitialized: true
}));

// Flash Middleware
app.use( flash() );

//Passport inits
app.use(passport.initialize());
app.use(passport.session());

// sETTing local variable for flash msgs
app.use( (req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.loggedUser = req.user || null

    next();
})



// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


// Routes
// --home
const home = require('./routes/home/home')
app.use('/', home)




app.listen(port, ()=>{
    console.log(`listening to port: ${port}`)
})