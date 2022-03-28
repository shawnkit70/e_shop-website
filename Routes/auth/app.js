const express = require("express");
const { validationResult } = require("express-validator");
const usersRepo = require("../../Repository/users");
const router = express.Router();
const { requireEmail , requirePassword , requirePasswordConfirmation , getEmail , getPassword , getHelp } = require( "./validation");


router.get("/signUp", (req, res) => {
  const sessionObj = req.session;
  const errors = null ;
  res.render("./users/signUp.ejs", { sessionObj , errors , getHelp  });
});

router.post(
  "/signUp",
  [ requireEmail, requirePassword, requirePasswordConfirmation ],
  async (req, res) => {
    //not that our name of object key vaue pair should be same in form so make sure to make form with same name attribute as them
    const errors = validationResult(req); //in order to commmunicate our validation to req object.
    console.log( errors ) ;
    const sessionObj = req.session;
    if ( !errors.isEmpty() ) {
      return res.render( './users/signUp.ejs' , { sessionObj ,errors, getHelp});
    }
    const { email, Password } = req.body;

    console.log(req.body);

    const nUser = await usersRepo.create({ email, Password });
    //now we need userId that we just create in order to mix it with the cookie string.

    //we are going to store the userID in our cookie and we are going to use 3rd party pakage i.e npmm cookie-session
    req.session.userId = nUser.id; //req.session is an object so we can add any key value pair we want in it.
    res.redirect("/admin/products");
  }
);

router.get("/signOut", (req, res) => {
  req.session = null;
  res.send("yur signed out !!");
});

router.get("/signIn", (req, res) => {
  const errors = null ;
  res.render("./users/signIn.ejs" , { errors , getHelp });
});

router.post("/signIn",[ getEmail , getPassword ] , async (req, res) => {
  const errors = validationResult(req) ;
  console.log(errors) ;
  if( !errors.isEmpty() ){
    return res.render( "./users/signIn.ejs" , { errors , getHelp } ) ;
  }
  const  email  = req.body.email ;
  const nUser = await usersRepo.getOneBy( {email} ) ;
  req.session.userId = nUser.id ;
  res.redirect("/admin/products");
});

module.exports = router;
