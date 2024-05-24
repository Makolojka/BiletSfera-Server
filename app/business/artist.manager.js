import artistDAO from "../DAO/artistDAO";

function create(context) {
    async function query() {
        let result = artistDAO.query();
        if (result) {
            return result;
        }
    }

    async function get(id) {
        let result = await artistDAO.get(id);
        if (result) {
            return result;
        }
    }

    async function createNewOrUpdate(data) {
        let result = await artistDAO.createNewOrUpdate(data);
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
