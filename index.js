const express = require("express");
const app = express();
const path = require( "path");
const authRouter = require( "./Routes/auth/app") ;
const adminProductsRouter = require("./Routes/auth/products") ;
const productsRouter = require("./Routes/products") ;
const cartsProduct = require("./Routes/cart") ;
const cookie = require( "cookie-session" );// this thing also help in to add new property to our req argument app.methods(req,res);

app.use( express.static('public') ) ;
app.set( "view engine" , "ejs");
app.set( "views", path.join(__dirname , "views"));
//always remember that our view engine has to be on our main index.js file that is this is the only place where it can be setup
//after that we are using router() and requiring it after setting up the views after that we will use it as object and all the work will willdone for use.
//but always remember to use(router at the end);

app.use( express.json() ) ;
app.use( express.urlencoded({extended:true}));
app.use( cookie(
{
    keys : ['snflsnflnslfnlsn']  //this is used to encrypt our data of  cookie so that anybooty cannot able to manipulate it
}
))

const PORT = process.env.PORT || 8081 ;
app.use(authRouter) ;
app.use(adminProductsRouter) ;
app.use(productsRouter) ;
app.use(cartsProduct) ;
app.listen( PORT , () => {
    console.log("listining!!");
})