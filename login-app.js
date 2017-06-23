const express = require('express');
var app = express()
const parseurl = require('parseurl');
const session = require('express-session');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');

app.engine('mustache', mustache() )
app.set('view engine', 'mustache');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

var users = [
  {userName: 'josh', password: '123'},
  {userName: 'jess', password: 'password'}
]

///show a login page for me
app.get('/login', function(req, res){
  res.render('login')
});

///verifies a user exists based on form data... This is for logging in.
app.post('/authenticate', function(req, res){

  let user = false;
  for (var i = 0; i < users.length; i++) {
    if (users[i].userName === req.body.userName) {
      if (users[i].password === req.body.password) {
        user = users[i]
      }
    }
  }

///if the user is in my array(database) then I store the user on the session (?) and send the user to the index.
  if (user){
    console.log("Found user: ", user)
    req.session.user = user;
    res.redirect("/index")
  } else { //otherwise send the user to login
    console.log("did not find user ", user)

    res.render("login")
  }
})

//Checks to see if the user has been logged in.
app.use( function (req, res, next) {

  if (req.session.user){ //this was set from a login back in lines 28-49.
    next() //go to the .index get
  } else {
    res.redirect('/login');
  }

});

app.get('/index', function(req, res, next){
  res.render('index', {title: 'home!'});
});


app.listen(3000, function(){
  console.log('Shits goin banananananas yall!');
});
