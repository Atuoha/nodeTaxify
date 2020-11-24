const express = require('express'),
    app = express(),
    router = express.Router(),
    faker = require('faker'),
    Contact = require('../../../models/Contact');


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})


router.get('/', (req, res)=>{
    Contact.find()
    .populate('user')
    .then(contacts=>{
        res.render('accounts/admin/contact', {contacts: contacts})
    })
    .catch(err=>console.log(err))
})



router.get('/loggedUser/:id', (req, res)=>{
    Contact.find({_id: req.params.id})
    .populate('user')
    .then(contacts=>{
        res.render('accounts/admin/contact/loggedInContacts', {contacts: contacts})
    })
    .catch(err=>console.log(err))
})


router.get('/create', (req, res)=>{
    res.render('accounts/admin/contact/create')
})


router.get('/dummy', (req, res)=>{
    res.render('accounts/admin/contact/dummy')
})


router.get('/edit/:id', (req, res)=>{
    Contact.findOne({_id: req.params.id})
    .then(contact=>{
        res.render('accounts/admin/contact/edit', {contact: contact})
    })
    .catch(err=>console.log(err))
})


router.post('/create', (req, res)=>{

    const newContact = new Contact()
    newContact.user = req.user.id
    // newContact.user = '5fb26dd6794fc32960e640c3'
    newContact.subject = req.body.subject
    newContact.message = req.body.message
    newContact.save()
    .then(savedContact=>{
        req.flash('success_msg', 'Contact has been created successfully :)')
        res.redirect('/admin/contacts')
    })
    .catch(err=>console.log(err))

})



router.post('/dummy', (req, res)=>{

    for(let i = 0; i < req.body.number; i++){
        const newContact = new Contact()
        newContact.user = req.user.id
        // newContact.user = '5fb26dd6794fc32960e640c3'
        newContact.subject = faker.random.word()
        newContact.message = faker.lorem.sentence()
        newContact.save()
        .then(savedContact=>{
            req.flash('success_msg', `${req.body.number} dummy contacts has been created successfully :)`)
            res.redirect('/admin/contact')
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
            res.redirect('/admin/contact')
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
            res.redirect('/admin/contact')
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
                res.redirect('/admin/contact')
            })
            .catch(err=>console.log(err)) 
        })        
    })
     .catch(err=>console.log(err))    
})


module.exports = router