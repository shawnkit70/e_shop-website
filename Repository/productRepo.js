const fs = require('fs') ;
const crypto  = require('crypto') ;
const util = require('util') ;
const Repository = require('./repository') ;

const scrypt = util.promisify(crypto.scrypt) ;

class productRepo extends Repository{

}

module.exports = new productRepo('products.json') ;