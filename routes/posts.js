var express = require('express'),
    router = express.Router(),
    middleware = require('../middleware'),
    sanitizeHTML = require('sanitize-html'),
    Post = require('../models/post');

// Posts INDEX
router.get('/', function(req, res) {
  Post.find({}, function(err, allPosts) {
    if (err) {
      console.log(err.toString());
    } else {
      res.render('blog/posts/index', {posts: allPosts});
    }
  });
});

// Posts CREATE
router.post('/', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
  var title = req.body.title,
      image = req.body.image,
      content = req.body.content,
      tags = req.body.tags,
      author = {
        id: req.user._id,
        username: req.user.username
      };

  // Sanitize HTML
  var cleanContent = sanitizeHTML(content, {
    allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'em', 'strong', 'a', 'ul', 'li', 'ol'],
    allowedAttributes: {
      a: ['href', 'target']
    }
  });

  var newPost = {title: title, image: image, content: cleanContent, author: author, tags: tags};

  Post.create(newPost, function(err, newPost) {
    if (err) {
      console.log(err.toString());
    }
  });
  res.redirect('/blog/posts');
});

// Posts NEW
router.get('/new', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
  res.render('blog/posts/new');
});

// Posts SHOW
router.get('/:id', function(req, res) {
  Post.findById(req.params.id).populate('comments').exec(function(err, foundPost) {
    if (err) {
      console.log(err.toString());
    } else {
      res.render('blog/posts/show', {post: foundPost});
    }
  });
});

// Posts EDIT
router.get('/:id/edit', middleware.checkPostOwnership, function(req, res) {
  Post.findById(req.params.id, function(err, foundPost) {
      res.render('blog/posts/edit', {post: foundPost});
  });
});

router.put('/:id', middleware.checkPostOwnership, function(req, res) {
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost) {
      res.redirect('/blog/posts/' + req.params.id);
  });
});

// Posts DESTROY
router.delete('/:id', middleware.checkPostOwnership, function(req, res) {
  Post.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect('/blog/posts');
    } else {
      res.redirect('/blog/posts');
    }
  });
});

module.exports = router;
