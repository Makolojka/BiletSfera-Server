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
        ,'./app/utils/artist.api.js'
        ,'./app/utils/event.api.js'
        ,'./app/utils/ticket.api.js'
        ,'./app/utils/user.api.js'
        ,'./app/utils/transactions.api.js'
        ,'./app/utils/swaggerSchemas.js'
    ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;