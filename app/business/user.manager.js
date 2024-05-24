import PasswordDAO from '../DAO/passwordDAO';
import TokenDAO from '../DAO/tokenDAO';
import UserDAO from '../DAO/userDAO';
import applicationException from '../service/applicationException';
import bcrypt from 'bcrypt';

function create(context) {

    async function hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async function authenticate(name, password) {
        const user = await UserDAO.getByEmailOrName(name);
        if (!user) {
            throw applicationException.new(applicationException.UNAUTHORIZED, 'User with that email does not exist');
        }

        const hashedPassword = await PasswordDAO.authorize(user.id);
        if (!hashedPassword || !(await bcrypt.compare(password, hashedPassword))) {
            throw applicationException.new(applicationException.UNAUTHORIZED, 'Incorrect password');
        }

        const token = await TokenDAO.create(user);
        return getToken(token);
    }

    async function authenticateOrganizer(name, password) {
        const organizer = await UserDAO.getByEmailOrName(name);
        if (!organizer || !organizer.isOrganizer) {
            throw applicationException.new(applicationException.UNAUTHORIZED, 'Organizer with that email does not exist');
        }

        const hashedPassword = await PasswordDAO.authorize(organizer.id);
        if (!hashedPassword || !(await bcrypt.compare(password, hashedPassword))) {
            throw applicationException.new(applicationException.UNAUTHORIZED, 'Incorrect password');
        }

        const token = await TokenDAO.create(organizer);
        return getToken(token);
    }

    function getToken(token) {
        return {token: token.value};
    }

    async function createNewOrUpdate(userData) {
        const user = await UserDAO.createNewOrUpdate(userData);
        if (userData.password) {
            const hashedPassword = await hashPassword(userData.password);
            await PasswordDAO.createOrUpdate({ userId: user.id, password: hashedPassword });
        }
        return user;
    }


    async function removeHashSession(userId) {
        return await TokenDAO.remove(userId);
    }

    return {
        authenticate: authenticate,
        authenticateOrganizer: authenticateOrganizer,
        createNewOrUpdate: createNewOrUpdate,
        removeHashSession: removeHashSession
    };
}

export default {
    create: create
};
