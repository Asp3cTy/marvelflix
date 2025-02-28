const axios = require("axios");
require("dotenv").config();

const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;

const bunnyApi = axios.create({
    baseURL: `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
    headers: {
        "AccessKey": BUNNY_API_KEY,
        "Content-Type": "application/json"
    }
});

module.exports = bunnyApi;
