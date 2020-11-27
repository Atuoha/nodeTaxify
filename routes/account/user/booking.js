if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePubKey = process.env.STRIPE_PUBLISHABLE_KEY
const stripe =  require('stripe')(stripeSecretKey)


const express = require('express'),
    app = express(),
    router = express.Router(),
    Booking = require('../../../models/Booking'),
    Destination = require('../../../models/Destination');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'user';
    next();
})    


router.get('/', (req, res)=>{
    Booking.find({user: req.user.id})
     .where('status').equals('active')
    // Booking.find({user:'5fb26dd6794fc32960e640c3'})
    .populate('user')
    .then(bookings=>{
         res.render('accounts/user/booking', {bookings: bookings});
    })
    .catch(err=>console.log(err))
})


router.get('/cancelled', (req, res)=>{
    Booking.find({user: req.user.id})
    .where('status').equals('unactive')
    // Booking.find({user:'5fb26dd6794fc32960e640c3'})
    .populate('user')
    .then(bookings=>{
         res.render('accounts/user/booking/cancelled', {bookings: bookings});
    })
    .catch(err=>console.log(err))
})

router.get('/create', (req, res)=>{
    Destination.find()
    .then(destinations=>{
        res.render('accounts/user/booking/create', {destinations: destinations, stripePubKey: stripePubKey});
    })
    .catch(err=>console.log(err));
})


router.get('/edit/:id', (req, res)=>{
    Booking.findOne({_id: req.params.id})
    .where('status').equals('active')
    .then(booking=>{
        Destination.find()
        .then(destinations=>{
            res.render('accounts/user/booking/edit', {booking: booking, destinations: destinations});
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})



router.get('/show/:id', (req, res)=>{
    Booking.findOne({_id: req.params.id})
    .then(booking=>{
        res.render('accounts/user/booking/show', {booking: booking});
    })
    .catch(err=>console.log(err))
})


router.post('/create', (req, res)=>{

    const newBooking =  new Booking()
    newBooking.location = req.body.location;
    newBooking.destination = req.body.destination;
    newBooking.booking_time = req.body.booking_time;
    newBooking.booking_date = req.body.booking_date;
    newBooking.price = req.body.price;
    newBooking.plan = req.body.plan;
    newBooking.date = new Date();
    newBooking.user = req.user.id;
    // newBooking.user = '5fb26dd6794fc32960e640c3';
    newBooking.save()
    .then(saved=>{
        req.flash('success_msg', 'Taxi booking process has been completed : )');
        res.redirect(`/user/booking/${req.user.id}`)
    })
    .catch(err=>console.log(err))
    
})


router.put('/:id/update', (req, res)=>{
    Booking.findOne({_id: req.params.id})
    .then(booking=>{
        booking.location = req.body.location;
        booking.destination = req.body.destination;
        booking.booking_time = req.body.booking_time;
        booking.booking_date = req.body.booking_date;
        newBooking.price = req.body.price;
        newBooking.plan = req.body.plan;
        booking.date = new Date();
        newBooking.user = req.user.id;
        // newBooking.user = '5fb26dd6794fc32960e640c3';
        booking.save()
        .then(saved=>{
            req.flash('success_msg', 'Taxi booking info has been updated successfully : )');
            res.redirect(`/user/booking/${req.user.id}`)
        })
        .catch(err=>console.log(err))
        })
    .catch(err=>console.log(err))
})



router.get('/cancel/:id', (req, res)=>{
    Booking.findOne({_id: req.params.id})
    .where('status').equals('active')
    .then(booking=>{
        booking.status = 'unactive';
        booking.save()
        .then(saved=>{
            req.flash('success_msg', 'Taxi booking has been cancelled successfully : )');
            res.redirect(`/user/booking/cancelled/${req.user.id}`)
        })
        .catch(err=>console.log(err))
        })
    .catch(err=>console.log(err))
})



router.get('/retrieve/:id', (req, res)=>{
    Booking.findOne({_id: req.params.id})
    .where('status').equals('unactive')
    .then(booking=>{
        booking.status = 'active';
        booking.save()
        .then(saved=>{
            req.flash('success_msg', 'Taxi booking has been retrieved successfully : )');
            res.redirect(`/user/booking/${req.user.id}`)
        })
        .catch(err=>console.log(err))
        })
    .catch(err=>console.log(err))
})



router.delete('/:id/delete', (req, res)=>{
    Booking.findOne({_id: req.params.id})
    .then(booking=>{
        booking.delete()
        .then(saved=>{
            req.flash('success_msg', 'Taxi booking info has been deleted successfully : )');
            res.redirect(`/user/booking/${req.user.id}`)
        })
        .catch(err=>console.log(err))
        })
    .catch(err=>console.log(err))
})


module.exports = router