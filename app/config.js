const config = {
    port: process.env.PORT || 3001,databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://Makolojka:0UIaFpoFtRh1pOga@clustermk.ka2ptj8.mongodb.net/SSB_DB?retryWrites=true&w=majority',
    JwtSecret: process.env.JWT_SECRET || 'secret'
};

export default config;
