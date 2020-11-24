const express = require('express'),
    app = express(),
    router = express.Router(),
    Post = require('../../../models/Post'),
    User = require('../../../models/User'),
    Testimony = require('../../../models/Testimony'),
    Destination = require('../../../models/Destination'),
    Booking = require('../../../models/Booking'),
    Contact = require('../../../models/Contact'),
    Media = require('../../../models/Media'),
    Category = require('../../../models/Category');




router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next()
})    


router.get('/', (req, res)=>{
    const promises = [
        User.countDocuments(),
        Testimony.countDocuments(),
        Post.countDocuments(),
        Destination.countDocuments(),
        Booking.countDocuments(),
        Contact.countDocuments(),
        Media.countDocuments(),
        Category.countDocuments(),

    ];

    Promise.all(promises).then(([userCount, testimonyCount, postCount, destinationCount, bookingCount, contactCount, mediaCount, categoryCount])=>{
        res.render('accounts/admin/index', {userCount: userCount, testimonyCount: testimonyCount, postCount: postCount, destinationCount: destinationCount, bookingCount: bookingCount, contactCount: contactCount, mediaCount: mediaCount, categoryCount: categoryCount})
    })
    .catch(err=>console.log(err))
})

module.exports = router;