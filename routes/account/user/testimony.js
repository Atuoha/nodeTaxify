const express = require('express'),
    app = express(),
    router = express.Router(),
    Testimony = require('../../../models/Testimony'),
    faker = require('faker'),
    {userAuth} = require('../../../helpers/authenticate');



//settting default layout
// router.all('/*', userAuth,  (req, res, next)=>{
//     req.app.locals.layout = 'user';
//     next();
// })

router.all('/*',  (req, res, next)=>{
    req.app.locals.layout = 'user';
    next();
})

router.get('/', (req, res)=>{
    Testimony.find({user: req.session.user})
    // Testimony.find({user: '5fb26dd6794fc32960e640c3'})
    .populate('user')
    .then(testimonies=>{
     res.render('accounts/user/testimony', {testimonies: testimonies})
    })
    .catch(err => console.log(err))

})

// create
router.post('/create', (req, res)=>{

    const newTest = new Testimony();
    newTest.content = req.body.content
    newTest.user = req.session.user;
    // newTest.user = '5fb26dd6794fc32960e640c3';


    newTest.save()
    .then(testimony=>{
        req.flash('success_msg', `Testimony has been created successfully :)`);
        res.redirect(`/user/testimonies`)
    })
    .catch(err => console.log(err))
})

// dummy
router.post('/dummy', (req, res)=>{
    
    for(let i = 0; i < req.body.number; i++){
        const newTest = new Testimony();
        newTest.content = faker.lorem.sentence();
         newTest.user = req.session.user;
        // newTest.user = '5fb26dd6794fc32960e640c3';
      

        newTest.save()
        .then(testimony=>{
            req.flash('success_msg', `${req.body.number} dummy testimonies successfully created  :)`);
            res.redirect(`/user/testimonies`)
        })
        .catch(err => console.log(err))
    }
})


// update
router.put('/:id/update', (req, res)=>{
    Testimony.findOne({_id: req.params.id})
    .then(testimony =>{
        testimony.content = req.body.content
        testimony.save()
        .then(response =>{
            req.flash('success_msg', `Testimony has been updated successfully :)`);
            res.redirect(`/user/testimonies`)
        })

    })
    .catch(err => console.log(err))
})

// delete
router.delete('/:id/delete', (req, res)=>{
    Testimony.findOne({_id: req.params.id})
    .then(testimony =>{
        testimony.delete()
        .then(response=>{
            req.flash('success_msg', `Testimony has been deleted successfully :)`);
            res.redirect(`/user/testimonies`)
        })
        .catch(err=>console.log(err))   
    })
    .catch(err => console.log(err))
    
})



module.exports = router;



