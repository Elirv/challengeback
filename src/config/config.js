const dotenv = require("dotenv");
const logger = require("loglevel");

dotenv.config();

logger.enableAll();

const ENV = process.env.NODE_ENV || "development";

const CONFIG = {
    development: {
        app: {
            PORT: process.env.PORT || 5005,
        },

        logger: {
            warn: logger.warn,
            info: logger.info,
            error: logger.error,
        },

        db: {
            uri: process.env.MONGODB_URI_CLUSTER,
        },

        // auth0: {
        //     client_origin: process.env.AUTH0_AUDIENCE,
        //     audience: process.env.AUTH0_ISSUER,
        //     issuer: process.env.APP_ORIGIN
        // }

    },
};

module.exports = CONFIG[ENV];