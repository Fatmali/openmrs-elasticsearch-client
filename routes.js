const dao = require('./dao');
const elasticsearchService = require('./elastic-service');
const _ = require('lodash');
exports.register = function (server, options, next) {

    server.route([
        {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply({ message: 'Welcome to Encounter Voider for Elastic.' });
        }
    }
]);
    next();
};


exports.register.attributes = {
    name: 'routes'
};
