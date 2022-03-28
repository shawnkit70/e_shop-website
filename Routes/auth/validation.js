const { check } = require("express-validator");
const usersRepo = require("../../Repository/users") ;

module.exports = {
  requireTitle :
  check('title')
  .trim()
  .isLength( { min: 5 , max : 30 } )
  .withMessage("Must be a valid title for the product!") ,
  requirePrice :
  check('productPrice')
  .toFloat()
  .isFloat( {min : 1} )
  .withMessage("Must be valid price!!") ,
  requireEmail: check('email')
  .trim()
  .normalizeEmail()
  .isEmail()
  .withMessage('Must be a valid email')
  .custom(async email => {
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
      throw new Error('Email in use');
    }
  }),
requirePassword: check('Password')
  .trim()
  .isLength({ min: 4, max: 20 })
  .withMessage('Must be between 4 and 20 characters'),
  requirePasswordConfirmation: check('passwordConfirmation')
  .trim()
  .isLength({ min: 4, max: 20 })
  .withMessage('Must be between 4 and 20 characters')
  .custom((passwordConfirmation, { req }) => {
    if (passwordConfirmation !== req.body.Password) {
      throw new Error('Passwords must match');
    }
    else {
      return true;
    }
  }),
  //we were recieving invalid innput error even if the password are same because the custom validator 
  //has to return something that is going to be used by the validationResult so if the if statement is 
  //false it has to return something and it cannot find anything thing to return it returns false and we 
  //get an invalid innput.
  getHelp : function getError(errors, prop) {
    try {
      return errors.mapped()[prop].msg;
    } catch (err) {
      return '';
    }
  },
  getEmail : check('email')
  .trim()
  .normalizeEmail()
  .isEmail().withMessage("Enter valid email!")
  .custom( async ( email ) =>{
   const user = await usersRepo.getOneBy({ email });
   if (!user) {
   throw new Error("Email not found!");
 }
  }) ,

  getPassword : check('Password')
  .trim()
  .custom( async ( Password , { req } ) => {
   const user = await usersRepo.getOneBy( { email:req.body.email })
   if (!user) {
     throw new Error("Invalid Password");
   }
   const valid = await usersRepo.compar(user.Password, Password);
 if (!valid) {
   throw new Error("Invalid Password!");
 }
  })
  
}