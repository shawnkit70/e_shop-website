const express = require("express") ;
const { validationResult } = require("express-validator");
const multer  = require('multer')
const { reqAuth , reqForedit } = require("../auth/middleware") ;
const productRepo = require("../../Repository/productRepo") ;
const { requireTitle , requirePrice , getHelp } = require("./validation") ;

const router  = express.Router() ;
const upload = multer( { storage : multer.memoryStorage() }) ;
//In order to store the file in some folder we just have to change the storage property inside the upload object above.

router.get( "/admin/products" , reqAuth ,  async ( req , res ) =>{
  const products = await productRepo.getAll() ;
  res.render( "./products/products.ejs" , { products });

}) ;

router.get( "/admin/products/new", reqAuth , ( req , res ) =>{
 const errors = null ;
  res.render( "./products/newProducts.ejs" , { errors , getHelp });
}) ;

//before encountering our multer function upload the req that has been made by the client comes in form of string which is encoded by multer so before that our 
//require title and requirePrice are unable to perform there check on it. The order that matter the most and thats not what we want .
//so first it has  to be passed through upload.single('image) and after that requireTitle and requirePrice would has req body to parse upon and check for error.
//before that it is unable to do so.
router.post( "/admin/products/new" , reqAuth , upload.single('image')
,[
    requireTitle , requirePrice
], async ( req , res) =>{
  const errors = validationResult(req) ;
  if ( !errors.isEmpty() ){
    return res.render( './products/newProducts.ejs' , { errors , getHelp });
  }
  console.log( errors ) ;
  const image = req.file.buffer.toString('base64') ;
  const { title , productPrice } = req.body ;
  await productRepo.create( { title , productPrice , image });
  res.redirect("/admin/products") ;
}) ;

router.get( '/admin/product/:id/edit' , reqAuth , async( req , res ) => {
  const  { id } = req.params ;
  const product = await productRepo.getOneBy( { id } ) ; 
  const errors = null ;
  res.render( "./products/editProduct.ejs" , { product , errors , getHelp }) ;

}) ;

router.post('/admin/product/:id/edit', reqAuth , upload.single("image") ,
 [ requireTitle , requirePrice ] 
 ,  async ( req , res) =>{

  const changes = req.body ;
  const errors = validationResult(req) ;
   if( !errors.isEmpty()) {
    console.log( errors ) ; 
    const product = await productRepo.getOne( req.params.id ) ;
     return res.render("./products/editProduct.ejs" , { product , errors , getHelp }) ;
   }
  
  if ( req.file ) {
     changes.image =  req.file.toString('base64') ;
  }
  try{
    await productRepo.update( req.params.id , changes ) ;
  }catch (err) {
    return res.send("Could not find the id !!") ;
  }
  
  res.redirect("/admin/products");

 } ) ;

router.post( "/admin/product/:id/delete" , reqAuth , async(req , res) =>{
  await productRepo.delete( req.params.id ) ;
  res.redirect('/admin/products') ;
})
 module.exports = router ;