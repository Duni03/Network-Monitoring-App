const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes/routes.js")

const app = express();

app.use(express.json());

mongoose.connect(
  `<Give Your Mongo Server>`, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  ).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));;


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


app.use(Router);

app.listen(3001,'0.0.0.0', () => {
  console.log("Server is running at port 3001");
});
