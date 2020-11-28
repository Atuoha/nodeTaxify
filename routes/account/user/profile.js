const { profile } = require('console');

const express = require('express'),
    app = express(),
    router = express.Router(),
    User = require('../../../models/User'),
    fs = require('fs'),
    {isEmpty, uploadDir} = require('../../../helpers/upload-helpers'),
    faker = require('faker'),
    bcrypt = require('bcryptjs');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'user';
    next()
})    


router.get('/', (req, res)=>{
    User.findOne({_id: req.session.user})
    .then(profile=>{
    console.log(req.session.user)
        res.render('accounts/user/profile', {profile: profile} );
    })
    .catch(err=>console.log(err))
})




router.get('/edit/:id', (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{
        res.render('accounts/user/profile/edit', {user: user})
    })
    .catch(err=>console.log(err))
})





router.put('/:id/update', (req, res)=>{

    User.findOne({_id: req.params.id})
    .then(user=>{

        let filename = user.file;
        if(!isEmpty(req.files)){
            let file = req.files.file
            filename = Date.now() + '-' + file.name
            let uploadDir = './public/uploads/';
            file.mv(uploadDir + filename, err=>{
                if(err)console.log(err)
            })

            if(user.file !== '' && user.file !== 'default.png'){
                fs.unlink(uploadDir + user.file, err=>{
                    if(err)console.log(err)
                })
            }
        }

        if(req.body.password !== ''){
            user.fullname = req.body.fullname
            user.email = req.body.email
            user.status = req.body.status
            user.role = req.body.role
            user.file = filename

            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(req.body.password, salt, (err, hash)=>{
                    if(err)console.log(err)
                    user.password = hash;
                    user.save()
                    .then(savedUser=>{
                        req.flash('success_msg', `${user.fullname} has been updated successfully`);
                        res.redirect(`/user/profile`)

                    })
                    .catch(err=>console.log(err))
                })
            })

        }
        user.fullname = req.body.fullname
        user.email = req.body.email
        user.status = req.body.status
        user.role = req.body.role
        user.file = filename
        user.save()
        .then(savedUser=>{
            req.flash('success_msg', `${user.fullname} has been updated successfully`);
            res.redirect(`/user/profile`)
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err))
})



router.delete('/:id/delete', (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{
        if(user.file !== '' && user.file !== 'default.png'){
            let uploadDir = './public/uploads/'
            fs.unlink(uploadDir + user.file, err=>{
                if(err)console.log(err)
            })
        }
        user.delete()
        .then(response=>{
            req.flash('success_msg', 'User deleted successfully :) ')
            res.redirect('/user/users');
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})


module.exports =  router;

