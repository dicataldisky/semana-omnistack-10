const { Router } = require('express');

const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

// METHOD: GET, POST, PUT, DELETE

// PARAMS:
// Query Params: request.query (Filters, Orders, Pagination, ...)
// Route Params: request.params (Identify one request for alt or remove)
// Body: request.body (Data to create or remove one register)

// MongoDB (Non-relational DataBase)

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

routes.get('/search', SearchController.index);

module.exports = routes;
