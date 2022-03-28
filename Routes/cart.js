const express = require("express") ;
const cartsRepo = require("../Repository/cartRepo") ;
const productRepo = require("../Repository/productRepo");

const router = express.Router() ;

// Receive a post request to add an item to a cart
router.post('/cart/products', async (req, res) => {
  // Figure out the cart!
  let cart;
  if (!req.session.cartId) {
    // We dont have a cart, we need to create one,
    // and store the cart id on the req.session.cartId
    // property
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // We have a cart! Lets get it from the repository
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  const existingItem = cart.items.find(item => item.id === req.body.productId);
  if (existingItem) {
    // increment quantity and save cart
    existingItem.quantity++;
  } else {
    // add new product id to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, {
    items: cart.items
  });

  res.send('Product added to cart');
});

router.get( "/cart" , async( req , res )=>{
 //check user exist or not then redirect them to main page 
  if ( !req.session.cartId ){
    return res.redirect("/") ;
  }  
  const cart = await cartsRepo.getOne( req.session.cartId ) ;
  for( let item of cart.items ){
    const product = await productRepo.getOne( item.id ) ;
    item.product = product ;
  }
  
  res.render( "./productShow/cart.ejs" , { items : cart.items }) ;
}) ;

router.post( "/cart/product/delete" , async ( req , res ) =>{
  const { itemId } = req.body ; 
  const cart = await cartsRepo.getOne( req.session.cartId ) ;
  const item = cart.items.filter( item => item.id !== itemId) ;//add all the element to the cart except that element which has to be deleted.
  console.log(item) ;
  await cartsRepo.update( req.session.cartId , { item } ) ;
  res.redirect("/cart") ;
})

module.exports = router ;