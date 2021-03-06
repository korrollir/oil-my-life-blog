var express = require('express'),
    router = express.Router(),
    dotenv = require('dotenv'),
    nodeMailer = require('nodemailer'),
    passport = require('passport'),
    sanitizeHTML = require('sanitize-html'),
    oils = require('../public/assets/scripts/data/oils-data'),
    faq = require('../public/assets/scripts/data/faq-data'),
    User = require('../models/user');

router.get('/', function(req, res) {
  // res.render('landing', {oils});
  res.redirect('blog/posts');
})
// About page
router.get('/blog/about', function(req, res) {
  res.render('about');
});

// FAQ page
router.get('/faq', function(req, res) {
  res.render('faq', {faq});
});

// Show register form
router.get('/register', function(req, res) {
  res.render('register');
});

// Auth logic
router.post('/register', function(req, res){
  var newUser = new User({username: req.body.username, role: 'user'});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err.toString());
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('blog/posts');
    });
  });
});

// Login form
router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/blog/posts',
    failureRedirect: '/login'
  }), function(req, res) {
});

// Logout route
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Logged out successfully');
  res.redirect('blog/posts');
});

// Send mail route
router.post('/send', function(req, res) {
  var sender = req.body.emailName,
      email = req.body.emailAddress,
      subject = req.body.emailSubject,
      message = req.body.emailMessage;

  var cleanMessage = sanitizeHTML(message, {
    allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'em', 'strong', 'a', 'ul', 'li', 'ol'],
    allowedAttributes: {
      a: ['href', 'target']
    }
  });

  // Configuration of mail sender
  var transporter = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAILLOGIN,
      pass: process.env.GMAILPASSWORD
    }
  });

  // Building e-mail message
  var mailOptions = {
    from: email,
    to: process.env.GMAILLOGIN,
    subject: subject,
    html: '<h2>' + sender + '</h2><h3>' + email + '</h3><p>' + cleanMessage + '</p>'
  };

  // Send mail and handle errors
  transporter.sendMail(mailOptions, function(error, info) {
    if(error) {
      return console.log(error.toString());
    }
    console.log('Message sent:', info.messageId, info.response);
    res.redirect('/');
  });
});

module.exports = router;
