const express = require('express'),
    app = express(),
    router = express.Router();


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'home';
    next()
})    


router.get('/', (req, res)=>{
    res.render('home/index');
})


router.get('/blogs', (req, res)=>{
    res.render('home/blogs');
})


router.get('/contact', (req, res)=>{
    res.render('home/contact');
})



router.get('/about', (req, res)=>{
    res.render('home/about');
})



router.get('/services', (req, res)=>{
    res.render('home/services');
})



router.get('/gallery', (req, res)=>{
    res.render('home/gallery');
})


router.get('/single_blog', (req, res)=>{
    res.render('home/single_blog');
})


module.exports = router;