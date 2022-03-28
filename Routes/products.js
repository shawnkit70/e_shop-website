const express = require("express") ;
const productRepo = require("../Repository/productRepo");

const router = express.Router() ;

router.get( "/" , async ( req ,res ) => {
    const product = await productRepo.getAll() ;
    res.render( "./productShow/show.ejs" , { product } ) ;
})

module.exports = router ;