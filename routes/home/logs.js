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
    if(req.session.user){
        if(req.session.user.role === 'Admin'){
            User.findOne({_id: req.session.user})
            .then(user=>{
                req.session.user = user
                res.redirect('/admin')
            })
            .catch(err=>console.log(err))
           
        }else{
            User.findOne({_id: req.session.user})
            .then(user=>{
                req.session.user = user
                res.redirect('/user')
            })
            .catch(err=>console.log(err))
        }
    }

    res.render('home/logs')
})    

router.post('/login', (req, res)=>{
   User.findOne({email: req.body.email})
   .then(user=>{
       if(!user){
        req.flash('error_msg', 'Email not recognised. Try again ): ');
        res.redirect('back');
       }else{
            bcrypt.compare(req.body.password, user.password, (err, matched)=>{
                if(err)console.log(err)
                if(matched){
                    if(user.role === 'Admin'){
                        req.session.user = user
                        res.redirect('/admin')
                        console.log('User logged in as a Admin')
                    }else{
                        req.session.user = user
                        res.redirect('/user')
                        console.log('User logged in as a Subscriber')
                    }
                }else{
                    req.flash('error_msg', 'Password mismatch. Try again ): ');
                    res.redirect('back');
                }
            })
       }
   })
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



router.get('/logout', (req, res)=>{
    req.session.user = ''
    res.redirect('/')
})


module.exports = router;