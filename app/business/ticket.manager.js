import ticketDAO from "../DAO/ticketDAO";

function create(context) {
    async function query() {
        let result = ticketDAO.query();
        if (result) {
            return result;
        }
    }

    async function get(id) {
        let result = await ticketDAO.get(id);
        if (result) {
            return result;
        }
    }

    async function createNewOrUpdate(data) {
        let result = await ticketDAO.createNewOrUpdate(data);
        if (result) {
            return result;
        }
    }

    return {
        query: query,
        get: get,
        createNewOrUpdate: createNewOrUpdate,
    };
}

export default {
    create: create
};
