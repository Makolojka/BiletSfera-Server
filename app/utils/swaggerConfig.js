const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SSB API DOCUMENTATION',
            version: '1.0.0',
            description: 'API Documentation for SSB system.',
        },
        servers: [
            {
                url: 'http://localhost:3001',
            },
        ],
    },
    apis: ['./app/app.js'
        ,'./app/REST/artist.endpoint.js'
        ,'./app/REST/event.endpoint.js'
        ,'./app/REST/post.endpoint.js'
        ,'./app/REST/ticket.endpoint.js'
        ,'./app/REST/user.endpoint.js'
        ,'./app/REST/transaction.endpoint.js'
        ,'./app/utils/swaggerSchemas.js'
    ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;