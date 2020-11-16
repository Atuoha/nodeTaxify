const express = require('express'),
    app = express(),
    router = express.Router(),
    User = require('../../../models/User'),
    fs = require('fs'),
    {isEmpty, uploadDir} = require('../../../helpers/upload-helpers'),
    faker = require('faker'),
    bcrypt = require('bcryptjs');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next()
})    


router.get('/', (req, res)=>{
    User.find()
    .then(users=>{
        res.render('accounts/admin/users', {users: users} );
    })
    .catch(err=>console.log(err))
})


router.get('/create', (req, res)=>{
    res.render('accounts/admin/users/create');
})


router.get('/dummy', (req, res)=>{
    res.render('accounts/admin/users/dummy');
})


router.get('/:id/edit', (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{
        res.render('accounts/admin/users/edit', {user: user})
    })
    .catch(err=>console.log(err))
})


router.post('/create', (req, res)=>{

    User.findOne({email: req.body.email})
    .then(user=>{
        if(user){
            req.flash('error_msg', 'Email already exists :)');
            res.redirect('/admin/users') 
        }else{
            let filename = ''
            if(!isEmpty(req.files)){
                let file = req.files.file;
                filename = Date.now() + '-' + file.name
                let uploadDir = './public/uploads/'
                file.mv(uploadDir + filename, err=>{
                    if(err)console.log(err)
                })
            }
        
            
            
            const newUser = new User()
            newUser.fullname = req.body.fullname;
            newUser.email = req.body.email;
            newUser.status = req.body.status;
            newUser.role = req.body.role;
            newUser.password = req.body.password;
            newUser.file = filename;
        
            bcrypt.genSalt(10, (err,salt)=>{
                bcrypt.hash(req.body.password, salt, (err,hash)=>{
                    if(err)console.log(err)
                    newUser.password = hash
                    newUser.save()
                    .then(savedUser=>{
                        req.flash('success_msg', 'New User Created :)');
                        res.redirect('/admin/users')
                    })
                    .catch(err=>console.log(err))
                })
            })
        }
    })
    .catch(err=>console.log(err))
  

})



router.post('/dummy', (req, res)=>{

    for(let i = 0; i < req.body.numbers; i++){
        const newUser = new User();
        newUser.fullname = faker.name.firstName() + ' ' + faker.name.lastName()
        newUser.email =  faker.internet.email()
        newUser.phone =  '+234-000-0000-000'
        newUser.role = 'Subscriber'
        newUser.status = 'Active'
        newUser.file = 'default.png'
        newUser.password = 'secret'

        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash('secret', salt, (err, hash)=>{
                if(err)console.log(err)
                newUser.password =  hash;
                newUser.save()
                .then(savedUser=>{
                    req.flash('success_msg', `${req.body.numbers} dummy users have been created :)`);
                    res.redirect('/admin/users');
                })
                .catch(err=>console.log(err))
            })
        })

    }
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
                        res.redirect('/admin/users')
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
            res.redirect('/admin/users')
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
            res.redirect('/admin/users');
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})


module.exports =  router;

