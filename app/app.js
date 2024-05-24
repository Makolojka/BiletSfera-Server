import bodyParser from 'body-parser';
import config from './config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import routes from './REST/routes';

const swaggerUi = require('swagger-ui-express');
const specs = require('./utils/swaggerConfig');

const app = express();
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '2048kb'}));

app.use(express.static('public'));

app.use(cors());

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

if (process.env.NODE_ENV === 'test') {
    // In memory database for testing environment
    const { MongoMemoryServer } = require('mongodb-memory-server');

    async function connectWithInMemoryDB() {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        mongoose.connect(uri, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }, (error) => {
            if (error) {
                console.error(error);
            } else {
                console.info('Connected to in-memory database');
            }
        });

        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                mongod.stop();
                console.error('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });
    }
    connectWithInMemoryDB();
} else {
    // Regular database for production
    mongoose.connect(config.databaseUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }, (error) => {
        if (error) {
            console.error(error);
        } else {
            console.info('Connect with database established');
        }
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.error('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
}

routes(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(config.port, function () {
    console.info(`Server is running at ${config.port}`)
});

export default app;


