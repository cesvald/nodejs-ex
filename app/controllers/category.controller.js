const Category = require('../models/category.model.js');

// Create and Save a new Category
exports.create = (req, res) => {
    // Validate request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Category name can not be empty"
        });
    }

    // Create a Category
    const category = new Category({
        name: req.body.name || "Unnamed Category"
    });
    
    // Save Category in the database
    category.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.category || "Some error occurred while creating the Category."
        });
    });

};

// Retrieve and return all categorys from the database.
exports.findAll = (req, res) => {
    const { page, perPage, sort } = req.query;
    const filterOption = req.query.name ? { name: {eq: req.query.name} } : { };
    const options = {
        page: parseInt(page, 10 || 1),
        limit: parseInt(perPage, 10) || 10,
        sort: {date: sort || 'desc'}
    };
    
    Category.paginate(filterOption, options).then(categories => {
        res.send(categories);
    }).catch(err => {
        res.status(500).send({
            message: err.category || "Some error occurred while retrieving categories."
        });
    });
};

// Find a single category with a categoryId
exports.findOne = (req, res) => {
    Category.findById(req.params.categoryId)
    .then(category => {
        if(!category) {
            return res.status(404).send({
                message: "Category not found with id " + req.params.categoryId
            });            
        }
        res.send(category);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Category not found with id " + req.params.categoryId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving category with id " + req.params.categoryId
        });
    });
};

// Update a category identified by the categoryId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Category name can not be empty"
        });
    }

    // Find category and update it with the request body
    Category.findByIdAndUpdate(req.params.categoryId, {
        name: req.body.name,
    }, {new: true})
    .then(category => {
        if(!category) {
            return res.status(404).send({
                message: "Category not found with id " + req.params.categoryId
            });
        }
        res.send(category);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Category not found with id " + req.params.categoryId
            });                
        }
        return res.status(500).send({
            message: "Error updating category with id " + req.params.categoryId
        });
    });
};

// Delete a category with the specified categoryId in the request
exports.delete = (req, res) => {
    Category.findByIdAndRemove(req.params.categoryId)
    .then(category => {
        if(!category) {
            return res.status(404).send({
                category: "Category not found with id " + req.params.categoryId
            });
        }
        res.send({category: "Category deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                category: "Category not found with id " + req.params.categoryId
            });                
        }
        return res.status(500).send({
            message: "Could not delete category with id " + req.params.categoryId
        });
    });
};