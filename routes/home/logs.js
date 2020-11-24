const express = require('express'),
    app = express(),
    User = require('../../models/User'),
    brcypt = require('bcryptjs'),
    router = express.Router();


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'logs'
    next()
})    

router.get('/sign', (req, res)=>{
    res.render('home/logs')
})    

router.post('/login', (req, res)=>{
    res.send('receiving response....')
})

router.post('/register', (req, res)=>{
    User.findOne({email: req.body.email})
    .then(user=>{
        if(user){
            req.flash('error_msg', 'User exists with email');
            res.redirect('back');
        }else{
            const newUser = new User();
            
        }
    })
})

module.exports = router;