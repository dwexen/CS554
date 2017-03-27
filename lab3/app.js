const express = require("express");
const bodyParser = require("body-parser");
const app = express();



app.use("/", express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname +'/public/html/movies.html');
});

app.get('*', (req, res) => {
    res.sendStatus(404);
});


app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});