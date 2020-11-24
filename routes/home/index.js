const express = require('express'),
    app = express(),
    Post = require('../../models/Post'),
    Media = require('../../models/Media'),
    Category = require('../../models/Category'),
    Testimony = require('../../models/Testimony'),
    Destination = require('../../models/Destination'),
    router = express.Router();


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'home';
    next()
})    


router.get('/', (req, res)=>{
    Post.find()
    .then(blog_posts=>{
        Post.find()
        .populate('category')
        .limit(2)
        .then(home_blogs=>{
            Post.find()
            .limit(2)
            .then(sidebar_posts=>{
                Category.find()
                .then(categories=>{
                    Testimony.find()
                    .populate('user')
                    .then(testimonies=>{
                        Destination.find()
                        .then(destinations=>{
                            Media.find()
                            .then(medias=>{
                                res.render('home/index', {blog_posts: blog_posts, home_blogs: home_blogs, sidebar_posts: sidebar_posts, categories: categories, testimonies: testimonies, destinations: destinations, medias: medias});
                            })
                            .catch(err=>console.log(err))
                        })
                        .catch(err=>console.log(err))
                    })
                    .catch(err=>console.log(err))
                })
                .catch(err=>console.log(err))
            })
            .catch(err=>console.log(err))
        })    
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
   
})


router.get('/blogs', (req, res)=>{
    Post.find()
    .populate('user')
    .populate('category')
    .then(blog_posts=>{
        res.render('home/blogs', {blog_posts: blog_posts});
    })
    .catch(err=>console.log(err))
    
})


router.get('/contact', (req, res)=>{
    res.render('home/contact');
})



router.get('/about', (req, res)=>{
    Testimony.find()
    .populate('user')
    .then(testimonies=>{
        Media.find()
        .then(medias=>{
            res.render('home/about', {testimonies: testimonies, medias: medias});
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
    
})



router.get('/services', (req, res)=>{
    res.render('home/services');
})



router.get('/gallery', (req, res)=>{
    Media.find()
    .then(medias=>{
        res.render('home/gallery', {medias: medias});
    })
    .catch(err=>console.log(err))
    
})


router.get('/single_blog/:id', (req, res)=>{
    Post.findOne({slug: req.params.id})
    .populate('user')
    .populate('category')
    .then(blog=>{
        Post.find()
        .limit(4)
        .then(sidebar_posts=>{
            Category.find()
            .then(categories=>{
                res.render('home/single_blog', {blog:blog, sidebar_posts: sidebar_posts, categories: categories});
            })
            .catch(err=>console.log(err))   
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})


router.get('/author_blog/:id', (req, res)=>{
    Post.find({user: req.params.id})
    .populate('user')
    .populate('category')
    .then(blog_posts=>{
        Post.find()
        .limit(4)
        .then(sidebar_posts=>{
            Category.find()
            .then(categories=>{
                res.render('home/author_blog', {blog_posts:blog_posts, sidebar_posts: sidebar_posts, categories: categories});
            })
            .catch(err=>console.log(err))   
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})



router.get('/category_blog/:id', (req, res)=>{
    Post.find({category: req.params.id})
    .populate('user')
    .populate('category')
    .then(blog_posts=>{
        Post.find()
        .limit(4)
        .then(sidebar_posts=>{
            Category.find()
            .then(categories=>{
                res.render('home/category_blog', {blog_posts:blog_posts, sidebar_posts: sidebar_posts, categories: categories});
            })
            .catch(err=>console.log(err))   
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})


module.exports = router;