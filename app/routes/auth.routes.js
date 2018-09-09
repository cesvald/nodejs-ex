module.exports = (app) => {
	const cors = require('cors')
	const passport = require('passport');
	const jwt = require('jsonwebtoken');
	const randtoken = require('rand-token') 
	const User = require('../models/user.model.js');
	
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
				
				if(err){
					console.log(err);
					const error = new Error('An Error occured');
					return next(error);
				}
				if(!user){
					res.send({errors: ['User or password incorrect']});
				}
				else {
					req.login(user, { session : false }, (error) => {
						if( error ) return next(error)
						else {
							//We don't want to store the sensitive information such as the
							//user password in the token so we pick only the email and id
							const body = { _id : user._id, email : user.email };
							//Sign the JWT token and populate the payload with the user email and id
							const token = jwt.sign({ user : body },'top_secret', { expiresIn: 300 });
							
							const refreshToken = randtoken.uid(256);
							
							user.refreshToken = refreshToken;
							
							console.log(user);
							user.save()
							.then(data => {
								console.log("New User");
								console.log(user);
								res.send({token: 'JWT ' + token, refreshToken: refreshToken, userId: user._id});
							}).catch(err => {
								res.status(500).send({
									message: err.message || "Some error occurred while adding refreshToken to user."
								});
							});
						}
					});	
				}
			} catch (error) {
				return next(error);
			}
		})(req, res, next);
	});
	
	app.post('/token', (req, res, next) => {
		if(req.body.userId && req.body.refreshToken) {
			User.findById(req.body.userId).then( user => {
				if(user.refreshToken == req.body.refreshToken){
					const body = { _id : user._id, email : user.email };
					const token = jwt.sign({ user : body }, 'top_secret', { expiresIn: 300 })
					const refreshToken = randtoken.uid(256);
					
					user.refreshToken = refreshToken;
					user.save()
					.then(data => {
						res.send({token: 'JWT ' + token, refreshToken: refreshToken, userId: user._id});
					}).catch(err => {
						res.status(500).send({
							message: err.message || "Some error occurred while adding refreshToken to user."
						});
					});
				}
				else{
					return res.status(401).send({ message: "No valid token" });	
				}
			}).catch(err => {
				return res.status(401).send({ message: "Wrong data sent" });
			});
		}
		else {
			res.send(401)
		}	
	});
}