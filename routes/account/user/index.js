const express = require('express'),
    app = express(),
    router = express.Router(),
    Testimony = require('../../../models/Testimony'),
    Booking = require('../../../models/Booking'),
    Contact = require('../../../models/Contact');



router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'user';
    next()
})    


router.get('/', (req, res)=>{
    Testimony.find({user: req.session.user})
    .then(testimonies=>{
        let keys =  Object.keys(testimonies);
        let testimonyCount= keys.length
        Contact.find({user: req.session.user})
        .then(contacts=>{
            let keys =  Object.keys(contacts);
            let contactCount = keys.length
            Booking.find({user: req.session.user})
            .then(booking=>{
                let keys =  Object.keys(booking);
                let bookingCount = keys.length

                let status = ''
                if(req.session.user.file && req.session.user.fullname){
                    status = '100%'
                }else{
                    status = '50%'
                }
                  res.render('accounts/user/index', {testimonyCount: testimonyCount, bookingCount: bookingCount, contactCount: contactCount, status: status})
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
  
})

module.exports = router;