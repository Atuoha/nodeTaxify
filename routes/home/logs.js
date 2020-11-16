const express = require('express'),
    app = express(),
    router = express.Router();


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'logs'
    next()
})    

router.get('/sign', (req, res)=>{
    res.render('home/logs')
})    

module.exports = router;