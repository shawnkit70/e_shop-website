const { validationResult } = require("express-validator");
const { getHelp } = require( "./validation" ) ;

module.exports = {
    reqAuth : function getAuth( req , res , next ){
        if ( !req.session.userId ){
            return res.redirect("/signIn") ;
        }

        next() ;
    } ,
    reqForedit : function errorCheck( dataCb ){
        
        return async(req , res, next) =>{
        const errors = validationResult(req) ;
        
        if ( !errors.isEmpty() ){
            let product = {} ;
            if(dataCb){
                product = await dataCb(req) ;
            }
        return res.render( './products/editProduct.ejs' , { errors , getHelp , ...product });
        }
        next() ;
     }
     }
}