const express =  require('express'),
    router = express.Router(),
    Post = require('../../../models/Post'),
    Category = require('../../../models/Category'),
    faker = require('faker'),
    {userAuth} = require('../../../helpers/authenticate'),
    { isEmpty } = require('../../../helpers/upload-helpers'),
    path = require('path'),
    fs = require('fs');



//settting default layout
// router.all('/*', userAuth, (req, res, next)=>{
//     req.app.locals.layout = 'admin';
//     next();
// })

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
})

// viewing post all posts page and populating it with contents from database
router.get('/', (req, res)=>{

    Post.find()
    .populate('category')
    .populate('user')
    .then(posts=> {
        res.render('accounts/admin/posts', {posts: posts})
    })
    .catch(err=>console.log(`Post Error: ${err}`))
    
})


//viewing creating post page
router.get('/create', (req, res)=>{

    Category.find()
     .then(categories =>{
         res.render('accounts/admin/posts/create-post', {categories: categories })
     })
});


// creating post
router.post('/create', (req, res)=>{

    let errors = [];

    if(!req.body.title){
        errors.push({message: 'Please add title'})
    }

    if(!req.body.body){
        errors.push({message: 'Please add body'})
    }

    if(!req.body.sub){
        errors.push({message: 'Please add sub title'})
    }

    if(errors.length > 0){
        res.render('accounts/admin/posts/create-post', {errors: errors})
    }else{


    // handling single file
    let filename = '';
    if(!isEmpty(req.files.file)){
    let file = req.files.file
    filename = Date.now() + '-' + file.name
    let dirUpload = './public/uploads/'
    file.mv(dirUpload + filename, err=>{
        if(err) throw err;
    })
    //

    }

    // multi_files --featuring images
    let multi_images = [];
    if(!isEmpty(req.files.multi_files)){
        req.files.multi_files.forEach(single_file=>{
            single_image = Date.now() + '-' + single_file.name
            multi_images.push(single_image)
            let dirUpload = './public/uploads/'
            single_file.mv(dirUpload + single_image, err=>{
                if(err) throw err;
            })
        })
    }

    const newPost = new Post(
        {
            title: req.body.title,
            sub: req.body.sub,
            status: req.body.status,
            category: req.body.category,
            file: filename,
            multi_files: multi_images,
            body: req.body.body,
            // user: req.user.id,
            user: '5fb26dd6794fc32960e640c3',
            date: new Date(),
        }
    )
    newPost.save()
    .then(post=> {
        req.flash('success_msg', `Post: ${post.title} has been created :)`)
        res.redirect('/admin/posts')
    })
    .catch(err=> console.log(err))

    }
});




// viewing edit page using id
router.get('/:id/edit', (req, res)=>{

    Post.findOne({_id: req.params.id})
    .then(post=>{
        Category.find()
        .then(categories =>{
            res.render('accounts/admin/posts/edit', {post: post, categories: categories})
            console.log(categories)
        })        
    })
})



// updating post using id
router.put('/:id/update',  (req, res)=>{
   
    Post.findOne({_id: req.params.id})
    .then(post=>{

        // handling single file
        let filename = post.file;
        if(!isEmpty(req.files.file)){
            let file = req.files.file
            filename = Date.now() + '-' + file.name
            let dirUpload = './public/uploads/'
            file.mv(dirUpload + filename, err=>{
                if(err) throw err;
            })

            if(post.file !== '' && post.file !== 'img_place.png'){
                let delDir = './public/uploads/'
                fs.unlink(delDir + post.file, err=>{
                    if(err)console.log(err)
                })
            }
        }

        // handling multi_files
        let multi_images_fromDB = post.multi_files;
        if(!isEmpty(req.files.multi_files)){
            multi_images_empty = [];
            req.files.multi_files.forEach(single_file=>{
                single_image = Date.now() + '-' + single_file.name
                multi_images_empty.push(single_image)
                let dirUpload = './public/uploads/'
                single_file.mv(dirUpload + single_image, err=>{
                    if(err) throw err;
                })           
            })

            post.multi_files.forEach(sing_file=>{
                if(sing_file !== '' && sing_file !== 'img_place.png'){
                    let delDir = './public/uploads/'
                    fs.unlink(delDir + sing_file, err=>{
                        if(err)console.log(err)
                    })
                }
            })
            post.multi_files.pull()
            post.multi_files = multi_images_empty;  // When multiple images are selected
        }else{
            post.multi_files = multi_images_fromDB;  // When multiple images are not selected
        }
    
        post.title = req.body.title;
        post.sub = req.body.sub;
        post.status = req.body.status;
        post.category = req.body.category;
        post.body = req.body.body;
        post.file = filename;
        // post.user =  req.user.id;
        post.user =  '5fb26dd6794fc32960e640c3';
        post.save()
         .then(updatedPost =>{
            req.flash('success_msg', `Post has successfully been updated. New title is ${updatedPost.title}`)
            res.redirect('/admin/posts');
         })
         .catch(err => console.log(`Updating Error from: ${err}`))      
    })
    .catch(err=> console.log(`Error from: ${err}`));   
})





//deleting post using id
router.delete('/:id/delete', (req, res)=>{

    Post.findOne({_id: req.params.id}) 
    .then(post=>{
        // deleting single file
        if(post.file !== 'img_place.png' && post.file !== ''){ 
            let delDir = './public/uploads/';
            fs.unlink( delDir + post.file, err=>{
                if(err) throw err;
            })
        }

        // deleting multi_files
        post.multi_files.forEach(sing_file=>{
            if(sing_file !== '' && sing_file !== 'img_place.png'){
                let delDir = './public/uploads/'
                fs.unlink(delDir + sing_file, err=>{
                    if(err)console.log(err)
                })
            }
        })
       
        post.delete()
         .then(post => {
            req.flash('success_msg', `Post: "${post.title}" and related comments has been deleted without errors :)`)
            res.redirect('/admin/posts')

        })
         .catch(err => console.log(`Deleting Error from: ${err}`))
    })
    .catch(err => console.log(`Error: ${err}`))
})



// generate dummy  data url to view page
router.get('/dummy', (req, res)=>{
    res.render('admin/dummy')
})


// posting dummy data using faker module
router.post('/generate-fake-posts', (req, res)=>{

    for(let i = 0; i < req.body.number; i++){
        let post = new Post()

        post.title = faker.name.title();
        post.sub = faker.random.words();
        post.status = 'public';
        post.body = faker.lorem.sentence();
        post.file = 'img_place.png';
        post.file = ['img_place.png','img_place.png'];
        post.slug = faker.name.title();
        // post.user = req.user.id;
        post.user = '5fb26dd6794fc32960e640c3';

        post.date = new Date()

        post.save()
        .then(posts =>{
            req.flash('success_msg', `Created ${req.body.number} dummy post(s) :)`)
        })
        .catch(err => console.log(err))
    }
    res.redirect('/admin/posts');


})


// viewing logged in posts
router.get('/myPost/:id', (req, res)=>{

    Post.find({user: req.params.id})
    .populate('user')
    .populate('category')
    .then(posts=>{
        res.render('accounts/admin/posts/loggedInUser_Post', {posts: posts})
    })
    .catch(err=> console.log(err))
})

module.exports = router;