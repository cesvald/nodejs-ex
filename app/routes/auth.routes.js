module.exports = (app) => {
	const cors = require('cors')
	const passport = require('passport');
	const jwt = require('jsonwebtoken');
	
	app.use(cors())
	app.use(passport.initialize());
	
	app.post('/signup', passport.authenticate('signup', { session : false }), (req, res, next) => {
		res.send({ 
			message : 'Signup successful',
			user : req.user
		});
	});
	
	app.post('/login', (req, res, next) => {
		passport.authenticate('login', (err, user, info) => {  
			try {
				if(err || !user){
					console.log(err);
					const error = new Error('An Error occured')
					return next(error);
				}
				req.login(user, { session : false }, (error) => {
					if( error ) return next(error)
					//We don't want to store the sensitive information such as the
					//user password in the token so we pick only the email and id
					const body = { _id : user._id, email : user.email };
					//Sign the JWT token and populate the payload with the user email and id
					const token = jwt.sign({ user : body },'top_secret');
					//Send back the token to the user
					return res.json({ token });
				});   
			} catch (error) {
				return next(error);
			}
		})(req, res, next);
	});

}