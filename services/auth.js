const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');

const UserModel = require('../app/models/user.model');

passport.use(new JWTstrategy({
  //secret we used to sign our JWT
  secretOrKey : 'top_secret',
  //we expect the user to send the token as a query paramater with the name 'secret_token'
  jwtFromRequest : ExtractJWT.fromAuthHeaderWithScheme("jwt")
}, (token, done) => {
  try {
    //If the token has expiration, raise unauthorized
    var expirationDate = new Date(token.exp * 1000)
    if(expirationDate < new Date()) {
      return done(null, false);
    }
    //Pass the user details to the next middleware
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));

//Create a passport middleware to handle user registration
passport.use('signup', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
    try {
      //Save the information provided by the user to the the database
      const hash = await bcrypt.hash(password, 10);
      const user = UserModel.create({ email: email, password: hash });
      //Send the user information to the next middleware
      return done(null, user);
    } catch (error) {
      done(error);
    }
}));

//Create a passport middleware to handle User login
passport.use('login', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
  try {
    //Find the user associated with the email provided by the user
    const user = await UserModel.findOne({ email });
    if( !user ){
      //If the user isn't found in the database, return a message
      return done(null, false, { errors : ['User or password invalid']});
    }
    //Validate password and make sure it matches with the corresponding hash stored in the database
    //If the passwords match, it returns a value of true.
    const validate = await user.isValidPassword(password);
    
    if( !validate ){
      return done(null, false, { errors : ['User or password invalid']});
    }
    //Send the user information to the next middleware
    return done(null, user, { success : ['Logged in Successfully']});
  } catch (error) {
      console.log(error)
    return done(error);
  }
}));

var auth = {
    authAdmin: function(req, res, next){
        UserModel.findById(req.user._id).then(user => {
            if(user.email == 'sistemas@evdsky.com'){
                next();
            }
            else{
                res.send({ 
        			message : 'Is not an admin',
        			user : req.user
        		});
            }
        });
    }
}

module.exports = auth;