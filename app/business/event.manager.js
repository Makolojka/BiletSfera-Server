import eventDAO from "../DAO/eventDAO";

function create(context) {
    async function query() {
        let result = eventDAO.query();
        if (result) {
            return result;
        }
    }

    async function get(id) {
        let result = await eventDAO.get(id);
        if (result) {
            return result;
        }
    }

    async function createNewOrUpdate(data) {
        let result = await eventDAO.createNewOrUpdate(data);
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
