const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();



// SETTIAMO SERVER CON EXPRESS
const app = express();
const port = process.env.PORT || 5000;



// SETTIAMO MIDDLEWARE
app.use(cors()); // no need for it because backend and frontend run on the same port
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));



// MONGODB E MONGOOSE
const uri = "mongodb+srv://Yassine:xZaQZMUE5l4lQNPi@cluster0.tmg9o.mongodb.net/SmartFitDB?retryWrites=true&w=majority"//process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'))
connection.once('open', () => {
    console.log("Connessione al database MongoDB avvenuta con successo!")
})


// HTTP REQUEST LOGGER
const athleteRouter = require('./routes/athletes');
const rulesRouter = require('./routes/rules');
app.use('/athletes', athleteRouter);
app.use('/rules', rulesRouter);



// FOR PRODUCTION:
// Step 1:

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

/* app.use(express.static(path.resolve(__dirname, "./build")));
// Step 2:
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./build", "index.html"));
}); */



// METTIAMO SERVER IN ASCOLTO SULLA PORTA
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})