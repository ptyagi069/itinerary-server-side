require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    apiUrl: process.env.API_URL ,
    apiurl2 : process.env.API_URL2,
};