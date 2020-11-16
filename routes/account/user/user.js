const express = require('express'),
    app = express(),
    router = express.Router();


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'user';
    next()
})


router.all('/', (req, res)=>{
    res.render('accounts/user/index')
})



module.exports  = router;