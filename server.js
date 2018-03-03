const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

hbs.registerHelper("screamIt", text => {
  return text.toUpperCase();
});

app.set("view engine", "hbs");
//Middleware.
//next() -> Tell when middleware function is done.
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile(`server.log`, log + "\n", err => {
    if (err) console.log("Unable to append to server.log");
  });
  next();
});

//maintainence middleware, stops requests cause it doesn't call next().
//IMPORTANT -> MIDDLEWARE IS CALLED IN THE ORDER IT IS CALLED, HERE THE STATIC HELP PAGE AND THE LOGGER MIDDLEWARE WILL STILL BE USED
//BECAUSE THEY ARE REGISTERED FIRST.
// app.use((req, res, next) => {
//   res.render("maintainence.hbs");
// });

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("home.hbs", {
    pageTitle: "Home Page",
    welcomeMessage: "Welcome to my homepage"
  });
});

app.get("/about", (req, res) => {
  res.render("about.hbs", {
    pageTitle: "About Page"
  });
});

app.get("/projects", (req, res) => {
  res.render("projects.hbs", {
    pageTitle: "My Projects"
  });
});

app.get("/bad", (req, res) => {
  res.send({
    errorMessage: "Bad request"
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
