const request = require('supertest');
import app from '../app';
import User  from '../DAO/userDAO';
import Password from '../DAO/passwordDAO';
import Ticket from '../DAO/ticketDAO';
import Artist from '../DAO/artistDAO';
import Event from '../DAO/eventDAO';

beforeEach(async () => {
    await User.model.deleteMany({});
    await Password.model.deleteMany({});
    await Ticket.model.deleteMany({});
    await Password.model.deleteMany({});
    await Artist.model.deleteMany({});
    await Event.model.deleteMany({});
});

describe('Create user tests', () => {
    it('should create user and respond with 200 status code', async () => {
        // Arrange
        const userData = {
            name: 'TEST',
            email: 'email@gmail.com',
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

    it('should not create user if it already exists', async () => {
        // Arrange
        const userData = {
            name: 'TEST',
            email: 'email@gmail.com',
            password: 'zaq123!@K'
        };

        //Act
        await request(app)
            .post('/api/user/create')
            .send(userData);

        const response2 = await request(app)
            .post('/api/user/create')
            .send(userData);

        //Assert
        expect(response2.status).toBe(400);
    });

    it('should not create user and respond with 400 status code for weak password', async () => {
        // Arrange
        const userData = {
            name: 'TEST',
            email: 'email@gmail.com',
            password: 'weakp'
        };

        // Arrange
        const response = await request(app)
            .post('/api/user/create')
            .send(userData);

        // Assert
        expect(response.status).toBe(400);
    });
});
describe('User Authentication/Login endpoint tests', () => {
    it('should authenticate a user with valid credentials', async () => {
        // Arrange
        const userData = {
            name: 'TEST',
            email: 'email@gmail.com',
            password: 'zaq123!@K'
        };

        const validCredentials = {
            login: 'TEST',
            password: 'zaq123!@K'
        };

        // Act
        await request(app)
            .post('/api/user/create')
            .send(userData);

        const response = await request(app)
            .post('/api/user/auth')
            .send(validCredentials);

        // Assert
        expect(response.status).toBe(200); //User logged in
        expect(response.body).toHaveProperty('token');
    });

    it('should return an error for invalid credentials', async () => {
        // Arrange
        const userData = {
            name: 'TEST',
            email: 'email@gmail.com',
            password: 'zaq123!@K'
        };

        const invalidCredentials = {
            login: 'TEST',
            password: 'qwerty'
        };


        // Act
        await request(app)
            .post('/api/user/create')
            .send(userData);

        const response = await request(app)
            .post('/api/user/auth')
            .send(invalidCredentials);

        // Assert
        expect(response.status).toBe(401); //Unauthorized
    });
});

describe('Logout user tests', () => {
    it('should logout user and respond with 200 status code', async () => {
        // Arrange
        const userData = {
            name: 'TEST',
            email: 'email@gmail.com',
            password: 'zaq123!@K'
        };

        const validCredentials = {
            login: 'TEST',
            password: 'zaq123!@K'
        };

        // Act
        const createdUser = await request(app)
            .post('/api/user/create')
            .send(userData);
        const { id: userId } = createdUser.body;

        const loginSession = await request(app)
            .post('/api/user/auth')
            .send(validCredentials);
        const { token } = loginSession.body;

        const response = await request(app)
            .delete(`/api/user/logout/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        // Assert
        expect(response.status).toBe(200);
    });
});

describe('Ticket tests', () => {
    it('should get tickets by ID and respond with 200 status code', async () => {
        // Create ticket
        const ticketDetails = {
            type: 'Auto Moto Fiesta',
            price: 129,
            dayOfWeek: 'sobota-niedziela',
            date: '12-13.08.2023',
            color: '#222222',
            maxNumberOfTickets: 20,
            availableTickets: 20,
        };
        const createdTicket = await request(app)
            .post(`/api/events/ticket`)
            .send(ticketDetails);
        const { id: ticketId } = createdTicket.body;

        // Act
        return request(app)
            .get(`/api/events/tickets/${ticketId}`)
            .then(response => {
                expect(createdTicket.status).toBe(200);
                expect(createdTicket.body.id).toBeDefined();
                expect(response.status).toBe(200);
                // expect(response.body).toHaveProperty('price');
                expect(response.body.price).toBe(129);
            });
    });
});

// Cart tests
describe('Users cart - Get users cart', ()  => {
    it('should get users cart and respond with 200 status code', async () => {
        // Arrange
        const userData = {
            name: 'TEST',
            email: 'email@gmail.com',
            password: 'zaq123!@K'
        };

        const loginCredentials = {
            login: 'TEST',
            password: 'zaq123!@K'
        };

        const createdUserResponse = await request(app)
            .post('/api/user/create')
            .send(userData);
        const { userId: userId } = createdUserResponse.body;

        const loginResponse = await request(app)
            .post('/api/user/auth')
            .send(loginCredentials);
        const token = loginResponse.body.token;

        // Act
        const getCartResponse = await request(app).get(`/api/user/${userId}/cart`).set('Authorization', "Bearer "+token)

        // Assert
        expect(getCartResponse.status).toBe(200);
    });
});

describe('Users cart - Add ticket(s) to cart', () => {
    it('should add ticket to user cart and respond with 200 status code', async () => {
        // Arrange
        // Create ticket
        const ticketDetails = {
            type: 'Auto Moto Fiesta',
            price: 129,
            dayOfWeek: 'sobota-niedziela',
            date: '12-13.08.2023',
            color: '#222222',
            maxNumberOfTickets: 20,
            availableTickets: 20,
        };
        const createdTicket = await request(app)
            .post(`/api/events/ticket/id`)
            .send(ticketDetails);
        const { id: ticketId } = createdTicket.body;

        // Create event
        const eventDetails = {
            title: 'Auto Moto Fiesta',
            image: 'https://www.ebilet.pl/media/cms/media/d0lkjovd/amf_poster_going_552x736-b45e835c-cbc7-00fe-b9cc-d46a8c80f7e8.webp',
            text: 'Pierwszy Festiwal Muzyczno – Motoryzacyjny...',
            additionalText: 'Festiwal łączy...',
            organiser: 'Good Show',
            tickets: [ticketId],
            date: '12-13.08.2023',
            location: 'Kielce',
            category: ['Muzyka', 'Inne'],
            subCategory: ['Rock', 'Metal'],
            views: 0
        };
        const createdEvent = await request(app)
            .post('/api/event')
            .send(eventDetails);
        const { id: eventId } = createdEvent.body;

        const userData = {
            name: 'TEST',
            email: 'email@gmail.com',
            password: 'zaq123!@K'
        };
        const createdUser = await request(app)
            .post('/api/user/create')
            .send(userData);
        const { userId: userId } = createdUser.body;

        // Authenticate the user
        const loginCredentials = {
            login: 'TEST',
            password: 'zaq123!@K',
        };
        const loginResponse = await request(app)
            .post('/api/user/auth')
            .send(loginCredentials);
        const token = loginResponse.body.token;


        // Act
        const addToCartResponse = await request(app)
            .post(`/api/user/${userId}/cart/add-ticket/${eventId}/${ticketId}`)
            .set('Authorization', "Bearer "+token)
            .send({ quantity: 2 });

        // Assert
        expect(loginResponse.status).toBe(200);
        expect(createdUser.status).toBe(200);
        expect(createdTicket.status).toBe(201);
        expect(createdEvent.status).toBe(200);
        expect(addToCartResponse.status).toBe(200);
        expect(addToCartResponse.body.user).toHaveProperty('cart');
        expect(addToCartResponse.body).toHaveProperty('success', true);
        expect(addToCartResponse.body).toHaveProperty('user');
    });
});

describe('Users cart - Remove ticket(s) from cart', () => {
    it('should remove ticket from users cart and respond with 200 status code', async () => {
        // Arrange
        // Create ticket
        const ticketDetails = {
            type: 'Auto Moto Fiesta',
            price: 129,
            dayOfWeek: 'sobota-niedziela',
            date: '12-13.08.2023',
            color: '#222222',
            maxNumberOfTickets: 20,
            availableTickets: 20,
        };
        const createdTicket = await request(app)
            .post(`/api/events/ticket/id`)
            .send(ticketDetails);
        const { id: ticketId } = createdTicket.body;

        // Create event
        const eventDetails = {
            title: 'Auto Moto Fiesta',
            image: 'https://www.ebilet.pl/media/cms/media/d0lkjovd/amf_poster_going_552x736-b45e835c-cbc7-00fe-b9cc-d46a8c80f7e8.webp',
            text: 'Pierwszy Festiwal Muzyczno – Motoryzacyjny...',
            additionalText: 'Festiwal łączy...',
            organiser: 'Good Show',
            tickets: [ticketId],
            date: '12-13.08.2023',
            location: 'Kielce',
            category: ['Muzyka', 'Inne'],
            subCategory: ['Rock', 'Metal'],
            views: 0
        };
        const createdEvent = await request(app)
            .post('/api/event')
            .send(eventDetails);
        const { id: eventId } = createdEvent.body;

        // Create user
        const userData = {
            name: 'TEST',
            email: 'email@gmail.com',
            password: 'zaq123!@K'
        };
        const createdUser = await request(app)
            .post('/api/user/create')
            .send(userData);
        const { userId: userId } = createdUser.body;

        // Authenticate/Log in the user
        const loginCredentials = {
            login: 'TEST',
            password: 'zaq123!@K',
        };
        const loginResponse = await request(app)
            .post('/api/user/auth')
            .send(loginCredentials);
        const token = loginResponse.body.token;

        const addToCartResponse = await request(app)
            .post(`/api/user/${userId}/cart/add-ticket/${eventId}/${ticketId}`)
            .set('Authorization', "Bearer "+token)
            .send({ quantity: 2 });

        // Act
        const removeFromCartResponse = await request(app)
            .post(`/api/user/${userId}/cart/remove-ticket/${eventId}/${ticketId}`)
            .set('Authorization', "Bearer "+token)
            .send({ quantity: 2 });

        // Assert
        expect(loginResponse.status).toBe(200);
        expect(createdUser.status).toBe(200);
        expect(createdTicket.status).toBe(201);
        expect(createdEvent.status).toBe(200);

        // First add ticket to the cart
        expect(addToCartResponse.status).toBe(200);
        expect(addToCartResponse.body.user).toHaveProperty('cart');
        expect(addToCartResponse.body).toHaveProperty('success', true);
        expect(addToCartResponse.body).toHaveProperty('user');

        // Remove the ticket from the cart
        expect(removeFromCartResponse.status).toBe(200);
        expect(removeFromCartResponse.body.user).toHaveProperty('cart');
        expect(removeFromCartResponse.body).toHaveProperty('success', true);
        expect(removeFromCartResponse.body).toHaveProperty('user');

    });
});


describe('Like or Follow tests', () => {
    it('should like or follow an event and respond with 200 status code', async () => {
        // Arrange
        // Create ticket
        const ticketDetails = {
            type: 'Auto Moto Fiesta',
            price: 129,
            dayOfWeek: 'sobota-niedziela',
            date: '12-13.08.2023',
        };
        const createdTicketResponse = await request(app)
            .post(`/api/events/ticket`)
            .send(ticketDetails);
        const { id: ticketId } = createdTicketResponse.body;

        // Create event
        const eventDetails = {
            title: 'Auto Moto Fiesta',
            image: 'https://www.ebilet.pl/media/cms/media/d0lkjovd/amf_poster_going_552x736-b45e835c-cbc7-00fe-b9cc-d46a8c80f7e8.webp',
            text: 'Pierwszy Festiwal Muzyczno – Motoryzacyjny...',
            additionalText: 'Festiwal łączy...',
            organiser: 'Good Show',
            tickets: [ticketId],
            date: '12-13.08.2023',
            location: 'Kielce',
            category: ['Muzyka', 'Inne'],
            subCategory: ['Rock', 'Metal'],
            views: 0
        };
        const createdEventResponse = await request(app)
            .post('/api/event')
            .send(eventDetails);
        const { id: eventId } = createdEventResponse.body;

        // Create user
        const userData = {
            name: 'TEST',
            email: 'email@gmail.com',
            password: 'zaq123!@K'
        };
        const createdUserResponse = await request(app)
            .post('/api/user/create')
            .send(userData);
        const { userId: userId } = createdUserResponse.body;

        // Authenticate/Log in the user
        const loginCredentials = {
            login: 'TEST',
            password: 'zaq123!@K',
        };
        const loginResponse = await request(app)
            .post('/api/user/auth')
            .send(loginCredentials);
        const token = loginResponse.body.token;

        // Action type like or follow
        const actionTypeLike = 'like';
        const actionTypeFollow = 'follow';

        // Act
        const likeResponse = await request(app)
            .post(`/api/profile/like-follow/${userId}/${eventId}/${actionTypeLike}`).set('Authorization', "Bearer "+token);

        const followResponse = await request(app)
            .post(`/api/profile/like-follow/${userId}/${eventId}/${actionTypeFollow}`).set('Authorization', "Bearer "+token);

        // Assert
        expect(loginResponse.status).toBe(200);
        expect(createdUserResponse.status).toBe(200);
        expect(createdTicketResponse.status).toBe(200);
        expect(createdEventResponse.status).toBe(200);

        // Like assert
        expect(likeResponse.status).toBe(200);

        // Follow assert
        expect(followResponse.status).toBe(200);
    });
});

describe('Active events tests', () => {
    it('should return active event with date greater than or equal to current date', async () => {
        // Arrange
        // Create ticket
        const ticketDetails = {
            type: 'Auto Moto Fiesta',
            price: 129,
            dayOfWeek: 'sobota-niedziela',
            date: '13.08.2023',
            color: '#222222',
            maxNumberOfTickets: 20,
            availableTickets: 20,
        };
        const createdTicket = await request(app)
            .post(`/api/events/ticket/id`)
            .send(ticketDetails);
        const { id: ticketId } = createdTicket.body;

        // Future event
        const futureEvent = {
            title: 'Auto Moto Fiesta 2',
            image: 'https://www.ebilet.pl/media/cms/media/d0lkjovd/amf_poster_going_552x736-b45e835c-cbc7-00fe-b9cc-d46a8c80f7e8.webp',
            text: 'Drugi Festiwal Muzyczno – Motoryzacyjny...',
            additionalText: 'Festiwal łączy...',
            organiser: 'Good Show',
            tickets: [ticketId],
            date: '13.08.2024',
            location: 'Kielce',
            category: ['Muzyka', 'Inne'],
            subCategory: ['Rock', 'Metal'],
            views: 0
        };
        // Past event
        const pastEvent = {
            title: 'Auto Moto Fiesta 1',
            image: 'https://www.ebilet.pl/media/cms/media/d0lkjovd/amf_poster_going_552x736-b45e835c-cbc7-00fe-b9cc-d46a8c80f7e8.webp',
            text: 'Pierwszy Festiwal Muzyczno – Motoryzacyjny...',
            additionalText: 'Festiwal łączy...',
            organiser: 'Good Show',
            tickets: [ticketId],
            date: '13.08.2023',
            location: 'Kielce',
            category: ['Muzyka', 'Inne'],
            subCategory: ['Rock', 'Metal'],
            views: 0
        };
        await request(app)
            .post('/api/event')
            .send(futureEvent);
        await request(app)
            .post('/api/event')
            .send(pastEvent);

        // Act
        const response = await request(app).get('/api/events');

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].title).toBe('Auto Moto Fiesta 2');
    });

    it('should return multiple active events with date greater than or equal to current date', async () => {
        // Arrange
        // Create ticket
        const ticketDetails = {
            type: 'Auto Moto Fiesta',
            price: 129,
            dayOfWeek: 'sobota-niedziela',
            date: '13.08.2023',
            color: '#222222',
            maxNumberOfTickets: 20,
            availableTickets: 20,
        };
        const createdTicket = await request(app)
            .post(`/api/events/ticket/id`)
            .send(ticketDetails);
        const { id: ticketId } = createdTicket.body;

        // Future event
        const futureEvent = {
            title: 'Auto Moto Fiesta 2',
            image: 'https://www.ebilet.pl/media/cms/media/d0lkjovd/amf_poster_going_552x736-b45e835c-cbc7-00fe-b9cc-d46a8c80f7e8.webp',
            text: 'Drugi Festiwal Muzyczno – Motoryzacyjny...',
            additionalText: 'Festiwal łączy...',
            organiser: 'Good Show',
            tickets: [ticketId],
            date: '13.08.2024',
            location: 'Kielce',
            category: ['Muzyka', 'Inne'],
            subCategory: ['Rock', 'Metal'],
            views: 0
        };
        const futureEvent2 = {
            title: 'Auto Moto Fiesta 3',
            image: 'https://www.ebilet.pl/media/cms/media/d0lkjovd/amf_poster_going_552x736-b45e835c-cbc7-00fe-b9cc-d46a8c80f7e8.webp',
            text: 'Drugi Festiwal Muzyczno – Motoryzacyjny...',
            additionalText: 'Festiwal łączy...',
            organiser: 'Good Show',
            tickets: [ticketId],
            date: '13.08.2025',
            location: 'Kielce',
            category: ['Muzyka', 'Inne'],
            subCategory: ['Rock', 'Metal'],
            views: 0
        };
        // Past event
        const pastEvent = {
            title: 'Auto Moto Fiesta 1',
            image: 'https://www.ebilet.pl/media/cms/media/d0lkjovd/amf_poster_going_552x736-b45e835c-cbc7-00fe-b9cc-d46a8c80f7e8.webp',
            text: 'Pierwszy Festiwal Muzyczno – Motoryzacyjny...',
            additionalText: 'Festiwal łączy...',
            organiser: 'Good Show',
            tickets: [ticketId],
            date: '13.08.2023',
            location: 'Kielce',
            category: ['Muzyka', 'Inne'],
            subCategory: ['Rock', 'Metal'],
            views: 0
        };
        await request(app)
            .post('/api/event')
            .send(futureEvent);
        await request(app)
            .post('/api/event')
            .send(futureEvent2);
        await request(app)
            .post('/api/event')
            .send(pastEvent);

        // Act
        const response = await request(app).get('/api/events');

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].title).toBe('Auto Moto Fiesta 2');
        expect(response.body[1].title).toBe('Auto Moto Fiesta 3');
    });

    it('should return an empty array when no events are available', async () => {
        // Arrange
        // Create ticket
        const ticketDetails = {
            type: 'Auto Moto Fiesta',
            price: 129,
            dayOfWeek: 'sobota-niedziela',
            date: '13.08.2023',
            color: '#222222',
            maxNumberOfTickets: 20,
            availableTickets: 20,
        };
        const createdTicket = await request(app)
            .post(`/api/events/ticket/id`)
            .send(ticketDetails);
        const { id: ticketId } = createdTicket.body;

        // Past event
        const pastEvent = {
            title: 'Auto Moto Fiesta 1',
            image: 'https://www.ebilet.pl/media/cms/media/d0lkjovd/amf_poster_going_552x736-b45e835c-cbc7-00fe-b9cc-d46a8c80f7e8.webp',
            text: 'Pierwszy Festiwal Muzyczno – Motoryzacyjny...',
            additionalText: 'Festiwal łączy...',
            organiser: 'Good Show',
            tickets: [ticketId],
            date: '13.08.2023',
            location: 'Kielce',
            category: ['Muzyka', 'Inne'],
            subCategory: ['Rock', 'Metal'],
            views: 0
        };
        await request(app)
            .post('/api/event')
            .send(pastEvent);

        // Act
        const response = await request(app).get('/api/events');

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(0);
    });
});

describe('Organiser tests', () => {
    it('should add event to organiser\'s owned events', async () => {
        // Arrange
        // Create ticket
        const ticketDetails = {
            type: 'Auto Moto Fiesta',
            price: 129,
            dayOfWeek: 'sobota-niedziela',
            date: '13.08.2023',
            color: '#222222',
            maxNumberOfTickets: 20,
            availableTickets: 20,
        };
        const createdTicket = await request(app)
            .post(`/api/events/ticket/id`)
            .send(ticketDetails);
        const { id: ticketId } = createdTicket.body;

        // Create an organizer user
        const organiserData = {
            name: 'OrganiserTest',
            email: 'organiser@test.com',
            password: 'zaq123!@K',
            role: 'organizer',
            isOrganizer: true
        };
        const createdOrganiserResponse = await request(app)
            .post('/api/user/create')
            .send(organiserData);
        const { userId: userId } = createdOrganiserResponse.body;

        // Authenticate/Log in the organizer
        const loginCredentials = {
            login: 'OrganiserTest',
            password: 'zaq123!@K',
        };
        const loginResponse = await request(app)
            .post('/api/user/auth')
            .send(loginCredentials);
        const token = loginResponse.body.token;

        // Create an event
        const eventDetails = {
            title: 'Auto Moto Fiesta',
            image: 'https://www.ebilet.pl/media/cms/media/d0lkjovd/amf_poster_going_552x736-b45e835c-cbc7-00fe-b9cc-d46a8c80f7e8.webp',
            text: 'Drugi Festiwal Muzyczno – Motoryzacyjny...',
            additionalText: 'Festiwal łączy...',
            organiser: 'Good Show',
            tickets: [ticketId],
            date: '13.08.2024',
            location: 'Kielce',
            category: ['Muzyka', 'Inne'],
            subCategory: ['Rock', 'Metal'],
            views: 0
        };

        const createdEventResponse = await request(app)
            .post('/api/event')
            .set('Authorization', "Bearer "+token)
            .send(eventDetails);
        const { id: eventId } = createdEventResponse.body;

        // Act
        const addEventResponse = await request(app)
            .post('/api/organizer/'+userId+'/add-event/'+eventId)
            .set('Authorization', "Bearer "+token)

        // Assert
        expect(addEventResponse.status).toBe(200);
    });

    it('should get organiser\'s owned events', async () => {
        // Arrange
        // Create ticket
        const ticketDetails = {
            type: 'Auto Moto Fiesta',
            price: 129,
            dayOfWeek: 'sobota-niedziela',
            date: '13.08.2023',
            color: '#222222',
            maxNumberOfTickets: 20,
            availableTickets: 20,
        };
        const createdTicket = await request(app)
            .post(`/api/events/ticket/id`)
            .send(ticketDetails);
        const { id: ticketId } = createdTicket.body;

        // Create an organiser user
        const organiserData = {
            name: 'OrganiserTest',
            email: 'organiser@test.com',
            password: 'zaq123!@K',
            role: 'organizer',
            isOrganizer: true
        };
        const createdOrganiserResponse = await request(app)
            .post('/api/user/create')
            .send(organiserData);
        const { userId: userId } = createdOrganiserResponse.body;

        // Authenticate/Log in the organiser
        const loginCredentials = {
            login: 'OrganiserTest',
            password: 'zaq123!@K',
        };
        const loginResponse = await request(app)
            .post('/api/user/auth')
            .send(loginCredentials);
        const token = loginResponse.body.token;

        // Create an event
        const eventDetails = {
            title: 'Auto Moto Fiesta',
            image: 'https://www.ebilet.pl/media/cms/media/d0lkjovd/amf_poster_going_552x736-b45e835c-cbc7-00fe-b9cc-d46a8c80f7e8.webp',
            text: 'Drugi Festiwal Muzyczno – Motoryzacyjny...',
            additionalText: 'Festiwal łączy...',
            organiser: 'Good Show',
            tickets: [ticketId],
            date: '13.08.2024',
            location: 'Kielce',
            category: ['Muzyka', 'Inne'],
            subCategory: ['Rock', 'Metal'],
            views: 0
        };

        const createdEventResponse = await request(app)
            .post('/api/event')
            .set('Authorization', "Bearer "+token)
            .send(eventDetails);
        const { id: eventId } = createdEventResponse.body;

        await request(app)
            .post('/api/organizer/'+userId+'/add-event/'+eventId)
            .set('Authorization', "Bearer "+token)

        // Act
        const ownedEventsResponse = await request(app)
            .get('/api/organizer/'+userId)
            .set('Authorization', "Bearer "+token)

        // Assert
        expect(ownedEventsResponse.status).toBe(200);
    });

    it('should get multiple organiser\'s owned events', async () => {
        // Arrange
        // Create ticket
        const ticketDetails = {
            type: 'Auto Moto Fiesta',
            price: 129,
            dayOfWeek: 'sobota-niedziela',
            date: '13.08.2023',
            color: '#222222',
            maxNumberOfTickets: 20,
            availableTickets: 20,
        };
        const createdTicket = await request(app)
            .post(`/api/events/ticket/id`)
            .send(ticketDetails);
        const { id: ticketId } = createdTicket.body;

        // Create an organiser user
        const organiserData = {
            name: 'OrganiserTest',
            email: 'organiser@test.com',
            password: 'zaq123!@K',
            role: 'organizer',
            isOrganizer: true
        };
        const createdOrganiserResponse = await request(app)
            .post('/api/user/create')
            .send(organiserData);
        const { userId: userId } = createdOrganiserResponse.body;

        // Authenticate/Log in the organiser
        const loginCredentials = {
            login: 'OrganiserTest',
            password: 'zaq123!@K',
        };
        const loginResponse = await request(app)
            .post('/api/user/auth')
            .send(loginCredentials);
        const token = loginResponse.body.token;

        // Create an event
        const eventDetails = {
            title: 'Auto Moto Fiesta',
            image: 'https://www.ebilet.pl/media/cms/media/d0lkjovd/amf_poster_going_552x736-b45e835c-cbc7-00fe-b9cc-d46a8c80f7e8.webp',
            text: 'Drugi Festiwal Muzyczno – Motoryzacyjny...',
            additionalText: 'Festiwal łączy...',
            organiser: 'Good Show',
            tickets: [ticketId],
            date: '13.08.2024',
            location: 'Kielce',
            category: ['Muzyka', 'Inne'],
            subCategory: ['Rock', 'Metal'],
            views: 0
        };

        const eventDetails2 = {
            title: 'Auto Moto Fiesta 2',
            image: 'https://www.ebilet.pl/media/cms/media/d0lkjovd/amf_poster_going_552x736-b45e835c-cbc7-00fe-b9cc-d46a8c80f7e8.webp',
            text: 'Drugi Festiwal Muzyczno – Motoryzacyjny...',
            additionalText: 'Festiwal łączy...',
            organiser: 'Good Show',
            tickets: [ticketId],
            date: '13.08.2025',
            location: 'Kielce',
            category: ['Muzyka', 'Inne'],
            subCategory: ['Rock', 'Metal'],
            views: 0
        };

        const createdEventResponse = await request(app)
            .post('/api/event')
            .set('Authorization', "Bearer "+token)
            .send(eventDetails);
        const { id: eventId } = createdEventResponse.body;
        const createdEventResponse2 = await request(app)
            .post('/api/event')
            .set('Authorization', "Bearer "+token)
            .send(eventDetails2);
        const { id: eventId2 } = createdEventResponse2.body;

        await request(app)
            .post('/api/organizer/'+userId+'/add-event/'+eventId)
            .set('Authorization', "Bearer "+token)
        await request(app)
            .post('/api/organizer/'+userId+'/add-event/'+eventId2)
            .set('Authorization', "Bearer "+token)

        // Act
        const ownedEventsResponse = await request(app)
            .get('/api/organizer/'+userId)
            .set('Authorization', "Bearer "+token)

        // Assert
        expect(ownedEventsResponse.status).toBe(200);
        expect(ownedEventsResponse.body.ownedEvents).toHaveLength(2);
    });
});
describe('User preferences tests', () => {
    it('should update user preferences and respond with 200 status code', async () => {
        // Arrange
        const userData = {
            name: 'TEST',
            email: 'email@gmail.com',
            password: 'zaq123!@K'
        };
        const createdUser = await request(app)
            .post('/api/user/create')
            .send(userData);
        const { userId: userId } = createdUser.body;

        // Authenticate/Log in the organiser
        const loginCredentials = {
            login: 'TEST',
            password: 'zaq123!@K',
        };
        const loginResponse = await request(app)
            .post('/api/user/auth')
            .send(loginCredentials);
        const token = loginResponse.body.token;

        // Update preferences
        const updatePreferencesBody = {
            name: 'TEST',
            email: 'email@gmail.com',
            id: userId,
            preferences: {
                selectedCategories: ['Kino', 'Muzyka'],
                selectedSubCategories: ['Pop', 'Rock']
            }
        };

        // Act
        const updateResponse = await request(app)
            .post('/api/user/update')
            .set('Authorization', "Bearer "+token)
            .send(updatePreferencesBody);

        // Assert
        expect(updateResponse.status).toBe(200);
        expect(Array.isArray(updateResponse.body)).toBeDefined();
    });

    it('should get user preferences and respond with 200 status code', async () => {
        // Arrange
        const userData = {
            name: 'TEST',
            email: 'email@gmail.com',
            password: 'zaq123!@K'
        };
        const createdUser = await request(app)
            .post('/api/user/create')
            .send(userData);
        const { userId: userId } = createdUser.body;

        // Authenticate/Log in the organiser
        const loginCredentials = {
            login: 'TEST',
            password: 'zaq123!@K',
        };
        const loginResponse = await request(app)
            .post('/api/user/auth')
            .send(loginCredentials);
        const token = loginResponse.body.token;

        // Update preferences
        const updatePreferencesBody = {
            name: 'TEST',
            email: 'email@gmail.com',
            id: userId,
            preferences: {
                selectedCategories: ['Kino', 'Muzyka'],
                selectedSubCategories: ['Pop', 'Rock']
            }
        };

        await request(app)
            .post('/api/user/update')
            .set('Authorization', "Bearer "+token)
            .send(updatePreferencesBody);

        // Act
        const preferencesResponse = await request(app)
            .get('/api/user/'+userId+'/preferences')
            .set('Authorization', "Bearer "+token)
        console.log('Preferences Response:', preferencesResponse.body);

        // Assert
        expect(preferencesResponse.status).toBe(200);
        expect(Array.isArray(preferencesResponse.body)).toBeDefined();
        expect(Array.isArray(preferencesResponse.body.preferences)).toBeDefined();
        expect(preferencesResponse.body.preferences.selectedCategories).toEqual(['Kino', 'Muzyka']);
        expect(preferencesResponse.body.preferences.selectedSubCategories).toEqual(['Pop', 'Rock']);
    });

    it('should get user preferences for empty array and respond with 200 status code', async () => {
        // Arrange
        const userData = {
            name: 'TEST',
            email: 'email@gmail.com',
            password: 'zaq123!@K'
        };
        const createdUser = await request(app)
            .post('/api/user/create')
            .send(userData);
        const { userId: userId } = createdUser.body;

        // Authenticate/Log in the organiser
        const loginCredentials = {
            login: 'TEST',
            password: 'zaq123!@K',
        };
        const loginResponse = await request(app)
            .post('/api/user/auth')
            .send(loginCredentials);
        const token = loginResponse.body.token;

        // Act
        const preferencesResponse = await request(app)
            .get('/api/user/'+userId+'/preferences')
            .set('Authorization', "Bearer "+token)

        // Assert
        expect(preferencesResponse.status).toBe(200);
        expect(Array.isArray(preferencesResponse.body)).toBeDefined();
        expect(preferencesResponse.body.preferences).toEqual({"oneTimeMonitChecked": false,
            "selectedCategories": [],
            "selectedSubCategories": []})
    });

    it('should get matched events based on user preferences and respond with 200 status code', async () => {
        // Arrange
        // Create ticket
        const ticketDetails = {
            type: 'Auto Moto Fiesta',
            price: 129,
            dayOfWeek: 'sobota-niedziela',
            date: '13.08.2023',
            color: '#222222',
            maxNumberOfTickets: 20,
            availableTickets: 20,
        };
        const createdTicket = await request(app)
            .post(`/api/events/ticket/id`)
            .send(ticketDetails);
        const { id: ticketId } = createdTicket.body;

        // Create an event
        const eventDetails = {
            title: 'Auto Moto Fiesta',
            image: 'https://www.ebilet.pl/media/cms/media/d0lkjovd/amf_poster_going_552x736-b45e835c-cbc7-00fe-b9cc-d46a8c80f7e8.webp',
            text: 'Drugi Festiwal Muzyczno – Motoryzacyjny...',
            additionalText: 'Festiwal łączy...',
            organiser: 'Good Show',
            tickets: [ticketId],
            date: '13.08.2024',
            location: 'Kielce',
            category: ['Muzyka', 'Inne'],
            subCategory: ['Rock', 'Metal'],
            views: 0
        };

        // Create user
        const userData = {
            name: 'TEST',
            email: 'email@gmail.com',
            password: 'zaq123!@K'
        };
        const createdUser = await request(app)
            .post('/api/user/create')
            .send(userData);
        const { userId: userId } = createdUser.body;

        // Authenticate/Log in the organiser
        const loginCredentials = {
            login: 'TEST',
            password: 'zaq123!@K',
        };
        const loginResponse = await request(app)
            .post('/api/user/auth')
            .send(loginCredentials);
        const token = loginResponse.body.token;

        await request(app)
            .post('/api/event')
            .set('Authorization', "Bearer "+token)
            .send(eventDetails);

        // Update preferences
        const updatePreferencesBody = {
            name: 'TEST',
            email: 'email@gmail.com',
            id: userId,
            preferences: {
                selectedCategories: ['Kino', 'Muzyka'],
                selectedSubCategories: ['Pop', 'Rock']
            }
        };
        await request(app)
            .post('/api/user/update')
            .set('Authorization', "Bearer "+token)
            .send(updatePreferencesBody);

        // Act
        const matchedEvents = await request(app)
            .get('/api/events/preferences/'+userId)
            .set('Authorization', "Bearer "+token)

        // Assert
        expect(matchedEvents.status).toBe(200);
        expect(Array.isArray(matchedEvents.body.matchedEvents)).toBe(true);
        expect(matchedEvents.body.matchedEvents.length).toBe(1);
    });
});