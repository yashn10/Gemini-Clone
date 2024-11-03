const express = require('express');
const app = express();
require('dotenv').config({ path: "./config.env" })
const cors = require('cors');
const port = process.env.PORT || 8000

app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173', 'https://gemini-clone-rosy-six.vercel.app'],
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    credentials: true // Enable credentials
}));

app.use(require("./routes"));


app.listen(port, () => {
    console.log(`Server running at port number: ${port}`);
})
