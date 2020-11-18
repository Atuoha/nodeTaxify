const express = require('express'),
    app = express(),
    router = express.Router(),
    Destination = require('../../../models/Destination'),
    faker = require('faker'),
    {userAuth} = require('../../../helpers/authenticate');



//settting default layout
// router.all('/*', userAuth,  (req, res, next)=>{
//     req.app.locals.layout = 'admin';
//     next();
// })

router.all('/*',  (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
})

router.get('/', (req, res)=>{
    Destination.find()
    .then(destinations=>{
     res.render('accounts/admin/destination', {destinations: destinations})
    })
    .catch(err => console.log(err))

})

// create
router.post('/create', (req, res)=>{

    const newDest = new Destination();
    newDest.title = req.body.title
    newDest.date = new Date();

    newDest.save()
    .then(destination=>{
        req.flash('success_msg', `${destination.title} created successfully :)`);
        res.redirect('/admin/destinations')
    })
    .catch(err => console.log(err))
})

// dummy
router.post('/dummy', (req, res)=>{
    
    for(let i = 0; i < req.body.number; i++){
        const newDest = new Destination();
        newDest.title = faker.lorem.word();
        newDest.date = new Date();

        newDest.save()
        .then(Destination=>{
            req.flash('success_msg', `${req.body.number} dummy destinations successfully created  :)`);
            res.redirect('/admin/destinations')
        })
        .catch(err => console.log(err))
    }
})


// update
router.put('/:id/update', (req, res)=>{
    Destination.findOne({_id: req.params.id})
    .then(destination =>{
        destination.title = req.body.title
        destination.save()
        .then(response =>{
            req.flash('success_msg', `${response.title} has been updated successfully :)`);
            res.redirect('/admin/destinations')
        })

    })
    .catch(err => console.log(err))
})

// delete
router.delete('/:id/delete', (req, res)=>{
    Destination.findOne({_id: req.params.id})
    .then(destination =>{
        req.flash('success_msg', `${destination.title} has been deleted successfully :)`);
        res.redirect('/admin/destinations')
    })
    .catch(err => console.log(err))
})



module.exports = router;



