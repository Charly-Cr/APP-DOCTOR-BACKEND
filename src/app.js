const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const router = require('./routes');
const errorHandler = require('./utils/errorHandler');
require('./models')

const app = express();

app.use(cors({
    origin: true,
    credentials: true // Permite el envío de cookies HTTP-only
}));


// Usar cookie-parser para parsear las cookies
app.use(cookieParser());

app.use(express.json());
app.use(helmet());


// rutas
app.use("/api/v1",router);
app.get("/", (req, res) => {
    return res.send("Child Connection API working!")
})

// middlewares después de las rutas
app.use(errorHandler)

module.exports = app;
