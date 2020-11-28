const express = require('express'),
    app = express(),
    router = express.Router(),
    faker = require('faker'),
    Contact = require('../../../models/Contact');


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'user'
    next()
})




router.get('/', (req, res)=>{
    Contact.find({user: req.session.user})
    // Contact.find({user: '5fb26dd6794fc32960e640c3'})
    .populate('user')
    .then(contacts=>{
        res.render('accounts/user/contact', {contacts: contacts})
    })
    .catch(err=>console.log(err))
})




router.get('/create', (req, res)=>{
    res.render('accounts/user/contact/create')
})


router.get('/edit/:id', (req, res)=>{
    Contact.findOne({_id: req.params.id})
    .then(contact=>{
        res.render('accounts/user/contact/edit', {contact: contact})
    })
    .catch(err=>console.log(err))
})


router.post('/create', (req, res)=>{

    const newContact = new Contact()
    newContact.user = req.session.user
    // newContact.user = '5fb26dd6794fc32960e640c3'
    newContact.subject = req.body.subject
    newContact.message = req.body.message
    newContact.save()
    .then(savedContact=>{
        req.flash('success_msg', 'Contact has been created successfully :)')
        res.redirect(`/`)
        
    })
    .catch(err=>console.log(err))

})



router.post('/dummy', (req, res)=>{

    for(let i = 0; i < req.body.number; i++){
        const newContact = new Contact()
        newContact.user = req.session.user
        // newContact.user = '5fb26dd6794fc32960e640c3'
        newContact.subject = faker.random.word()
        newContact.message = faker.lorem.sentence()
        newContact.save()
        .then(savedContact=>{
            req.flash('success_msg', `${req.body.number} dummy contacts has been created successfully :)`)
            res.redirect(`/user/contact`)
        })
        .catch(err=>console.log(err))
    }
})



router.post('/update/:id', (req, res)=>{

    Contact.findOne({_id: req.params.id})
    .then(contact=>{
        contact.subject = req.body.subject
        contact.message = req.body.message
        contact.save()
        .then(savedContact=>{
            req.flash('success_msg', 'Contact has been updated successfully :)') 
            res.redirect(`/user/contact`)
  
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})


router.get('/delete/:id', (req, res)=>{

    Contact.findOne({_id: req.params.id})
    .then(contact=>{
        contact.delete()
        .then(response=>{
            req.flash('success_msg', `${contact.subject} has been deleted successfully :)`)
            res.redirect(`/user/contact`)
            
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})




// Multi Action on contacts
router.post('/multiaction', (req, res)=>{
    console.log(req.body.checkboxes)

    Contact.find({_id: req.body.checkboxes})
    .then(contacts=>{
        contacts.forEach(contact=>{
            contact.delete()
            .then(response=>{
                req.flash('success_msg', `${contact.subject} has been deleted successfully :)`)
                res.redirect(`/user/contact`)
                
            })
            .catch(err=>console.log(err)) 
        })        
    })
     .catch(err=>console.log(err))    
})


module.exports = router