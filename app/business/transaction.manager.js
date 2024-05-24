import transactionDAO from "../DAO/transactionDAO";

function create(context) {
    async function query() {
        let result = transactionDAO.query();
        if (result) {
            return result;
        }
    }

    async function get(id) {
        let result = await transactionDAO.get(id);
        if (result) {
            return result;
        }
    }

    async function createNewOrUpdate(data) {
        let result = await transactionDAO.createNewOrUpdate(data);
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
