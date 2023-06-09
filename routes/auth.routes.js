const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const bcryptjs = require ('bcryptjs')
const saltRounds = 13
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/


/* GET register */
router.get("/register", (req, res, next) => {
  let isLogged = false
if(req.session.existingUser){
    isLogged = true
  }
  res.render("auth/register", {isLogged});
});

/* POST register */
router.post("/register", async(req, res, next) => { 
    try{
      let isLogged = false
      if(req.session.existingUser){
          isLogged = true
        }
        //check if email exists
        const foundEmail = await User.findOne({email: req.body.email})
        if (foundEmail){//if the email exists
            res.render('auth/register', {errorMessage: 'This email already exists. Go to the Log-In page', data: {email: req.body.email}, isLogged})
        }else{
            const foundUsername = await User.findOne({username: req.body.username})
            if (foundUsername){//if the username exists
                res.render('auth/register', {errorMessage: 'This username already exists. Please choose a different one', data: {email:req.body.email ,username: req.body.username}, isLogged})
            }else{//if email does not exist and username does not exist
              //check if password is good enough
              if(pwdRegex.test(req.body.password)){//if password is good enough
                const salt = bcryptjs.genSaltSync(saltRounds)
                const passwordHash = bcryptjs.hashSync(req.body.password, salt)
                const newUser = await User.create({username: req.body.username, email:req.body.email, passwordHash: passwordHash})
                res.redirect('/auth/login')
              }else{//password not good enough
                res.render('auth/register', {errorMessage: 'This password is not strong enough. Please remember that the password must contain at least 8 characters and include at least one letter and one number', data: {email:req.body.email ,username: req.body.username}, isLogged})
              }
            }
        }
    }
    catch(err){
        console.log(err)
    }
  });



/* GET login */
router.get("/login", (req, res, next) => {
  let isLogged = false
if(req.session.existingUser){
    isLogged = true
  }
    res.render("auth/login", {isLogged});
  });

  /* POST login */
router.post("/login", async(req, res, next) => {
  let isLogged = false
  if(req.session.existingUser){
      isLogged = true
    }
  const existingUser = await User.findOne({email: req.body.email})
  if (!existingUser){
    res.render('auth/login', {errorMessage: 'This email is not registered. Please go to the Register page', data: {email: req.body.email}, isLogged})
  }else{//if the user exists
    //check if password is right
    if (bcryptjs.compareSync(req.body.password, existingUser.passwordHash)){//if password is correct
      req.session.existingUser = {existingUser: existingUser.username}
      res.redirect('/profile')
    }else{//if password is wrong
      res.render('auth/login', {errorMessage: 'The password does not match our records', data: {email: req.body.email}, isLogged})
    }
  }
});


module.exports = router;
