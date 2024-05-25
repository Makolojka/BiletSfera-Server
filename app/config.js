const config = {
    port: process.env.PORT || 3001,databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://mongoDB_URL',
    JwtSecret: process.env.JWT_SECRET || 'secret'
};

export default config;
