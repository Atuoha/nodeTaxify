const express = require('express'),
    app = express(),
    router = express.Router();


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next()
})


router.all('/', (req, res)=>{
    res.render('accounts/admin/index')
})





module.exports  = router;
