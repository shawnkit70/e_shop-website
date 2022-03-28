const crypto = require('crypto');
const util = require("util");
const Repository = require("./repository") ;

const scrypt = util.promisify(crypto.scrypt);//this promisify the callback scrypt. which helps alot i.e version of the function that return promise

class UsersRepository extends Repository{
  
  async create(attrs) {
    attrs.id = this.randomId();
    const salt = crypto.randomBytes(8).toString('hex');
    const hashed = await scrypt( attrs.Password , salt , 64); //returns a hashed value of the password which are necesaary for security reasons and its type is buffer
    const records = await this.getAll();
    const record = {
      ...attrs,
      Password: `${hashed.toString('hex')}.${salt}`  //this period or dot operator tells use that were the password stops and salts begin 
    };
    records.push( record );
    /*{
      ...attrs,
      Password: `${hashed.stringify('hex')}.${salt}` 
    }
    What this thing does is create new object take the property from the attrs object ...attrs replaces Password: value from that pair which is given. This is same as Object.assign
    */
    await this.writeAll(records);
    return record ;
  }
//this function below is going to help use compare the password from the database after performing certain fucntion on it.
  async compar( saved , supplied){
  
    const [ hashed , salt ] = saved.split('.') ;//they are fucking array not object
    const hashedSuppBuff = await scrypt( supplied , salt , 64 ) ;
    return hashed === hashedSuppBuff.toString('hex') ;
    //its going to compare wether our password is same or not from the database.

  }
  
}

//we are exporting the intance rather than exporting the class itself because it might create a situation where if we create two intance of the class due to different name error it can create a new file.

module.exports = new UsersRepository('users.json');
