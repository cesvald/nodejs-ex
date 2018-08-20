module.exports = (app) => {
    var cors = require('cors')
    
    app.use(cors())
    
    const categories = require('../controllers/category.controller.js');

    // Retrieve all categories
    app.get('/categories', categories.findAll);

    // Retrieve a single Category with categoryId
    app.get('/categories/:categoryId', categories.findOne);
}