const request = require('supertest');
import app from '../app';
import User  from '../DAO/userDAO';
import Password from '../DAO/passwordDAO';
import Ticket from '../DAO/ticketDAO';
import Artist from '../DAO/artistDAO';
import Event from '../DAO/eventDAO';
afterEach(done => {
    app.close(done);
});

beforeEach(async () => {
    await User.model.deleteMany({});
    await Password.model.deleteMany({});
    await Ticket.model.deleteMany({});
    await Password.model.deleteMany({});
    await Artist.model.deleteMany({});
    await Event.model.deleteMany({});
});

describe('Create user endpoint', () => {
    it('should create user and respond with 200 status code', async () => {
        // Arrange
        const userData = {
            name: 'TEST5',
            email: 'email@gmail5.com',
            password: 'zaq123!@K'
        };

        //Act
        const response = await request(app)
            .post('/api/user/create')
            .send(userData);

        //Assert
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined(); // Isn't undefined?
        expect(response.body).toBeTruthy(); // Isn't null?
    });
});