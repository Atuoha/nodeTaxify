if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const StripePubKey = process.env.STRIPE_PUBLISHABLE_KEY


const express = require('express'),
    app = express(),
    path = require('path'),
    handlebars = require('express-handlebars'),
    Handlebars = require('handlebars'),
    port = process.env.PORT || 5555,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access'),
    methodOverride = require('method-override'),
    upload = require('express-fileupload'),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport'),
    fetch = require('node-fetch'),
    {mongoDburl} = require('./config/database');

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);


mongoose.connect(mongoDburl, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(db=> console.log('Connected'))
    .catch(err=> console.log(err))

app.use(express.static(path.join(__dirname, 'public'))) // Loading Static files like css, js and stuffs







// custom select handlebars function
const {select, generate_date, ifeq, paginate} = require('./helpers/handlebars-helpers')

// 

// --SETTING view engine using handlebars
app.engine('handlebars', handlebars(
    {
        defaultLayout: 'home',
        helpers:{select: select, generate_date: generate_date, ifeq: ifeq, paginate: paginate},
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


// const stripe = require('stripe')(stripeSecretKey);

// const sessions = await stripe.checkout.sessions.create({
//   payment_method_types: ['card'],
//   mode: 'setup',
//   success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
//   cancel_url: 'https://example.com/cancel',
// });


// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


// Routes
// ROUTES --home
const home = require('./routes/home/index')
app.use('/', home)

// logs 
const logs = require('./routes/home/logs');
app.use('/logs', logs);




// accounts Routes



// admin ROUTES SECTION
const admin = require('./routes/account/admin/index');
app.use('/admin', admin)


// admin users
const admin_users = require('./routes/account/admin/user');
app.use('/admin/users', admin_users)


const admin_category = require('./routes/account/admin/category');
app.use('/admin/categories', admin_category)

const admin_posts = require('./routes/account/admin/post');
app.use('/admin/posts', admin_posts)


const admin_destination = require('./routes/account/admin/destination');
app.use('/admin/destinations', admin_destination)


const admin_media = require('./routes/account/admin/media');
app.use('/admin/media', admin_media)


const admin_contact = require('./routes/account/admin/contact');
app.use('/admin/contact', admin_contact)


const admin_booking = require('./routes/account/admin/booking');
app.use('/admin/booking', admin_booking)


const admin_testimonies = require('./routes/account/admin/testimony');
app.use('/admin/testimonies', admin_testimonies)

// 






// user ROUTES SECTION
const user = require('./routes/account/user/index');
app.use('/user', user)


const user_contact = require('./routes/account/user/contact');
app.use('/user/contact', user_contact)


const user_booking = require('./routes/account/user/booking');
app.use('/user/booking', user_booking)


const user_testimonies = require('./routes/account/user/testimony');
app.use('/user/testimonies', user_testimonies)


const user_profile = require('./routes/account/user/profile');
app.use('/user/profile', user_profile)

// 




app.listen(port, ()=>{
    console.log(`listening to port:${port}`)
})