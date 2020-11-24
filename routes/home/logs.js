const express = require('express'),
    app = express(),
    User = require('../../models/User'),
    bcrypt = require('bcryptjs'),
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
            req.flash('error_msg', 'User exists with email ):');
            res.redirect('back');
        }else{
            const newUser = new User();
            newUser.email = req.body.email;
            newUser.phone = req.body.phone;
            newUser.password = req.body.password;

            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(req.body.password, salt, (err, hash)=>{
                    if(err)console.log(err)
                    newUser.password = hash
                    newUser.save()
                    .then(savedResponse=>{
                        req.flash('success_msg', 'Account created. Sign in buddy :) ');
                        res.redirect('back');
                    })
                    .catch(err=>console.log(err))
                })
            })
            
        }
    })
    .catch(err=>console.log(err))
})

module.exports = router;