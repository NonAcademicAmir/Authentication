console.log("BACKEND JS IS CONNECTED")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")

//Remember to change port as you wish
const PORT = 3000

//remember to change connect adress
mongoose.connect("mongodb://127.0.0.1/auth")

//Using mongoose and mongodb
const mainSchemaMongo = new mongoose.Schema({
  email: String,
  password: String,
})
const address = mongoose.model("items ", mainSchemaMongo)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set("view engine", "ejs")

app.get("/", function (req, res) {
  // This is homepage, which is login page. Signup page has a different path
  res.render("login")
})
app.get("/signup", function (req, res) {
  res.render("signup")
})

//Both Login and Signup request will be sent here
app.post("/sign", function (req, res) {
  console.log("sign request received")
  //REMEMBER TO VALIDATE EMAIL AND PASSWROD HERE AS WELL AS FRONTEND, BECAUSE IT IS POSSIBLE TO SENT REQUESTS TO THE SERVER DIRECTLY
  if (
    req.body.email.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    ) &&
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(
      req.body.password,
    )
  ) {
    //Email and Password both are in a correct form
  } else {
    res.redirect("/")
  }
  if (req.body.type === "login") {
    console.log("login attemted")
    //In order to debug better, WE WILL PRINT EMAIL, PASSWORD AND TYPE OF SIGNING BELOW
    console.log(req.body)
    const tryToAuthenticateUsingDatabase = address
      .find({ email: req.body.email })
      .exec()
      .then(function (x) {
        //X is a list of data returned by database which is supposed to match the entered email by user
        if (x.length > 1) {
          //means there is duplicate email in the database. needs action
        }
        if (x.length < 1) {
          //user doesn't exist or
          /// email and password are wrong
          // console.log("email and passwrod are wrong")
          //IF YOU DON'T RESPOND HERE, YOUR SERVER WILL CRASH
          res.status(401).send("Email and Passwrod are wrong")
        } else {
          //In this statement, we have found the email in the database but we should check if the entered password matches the one on the database
          //req.body.password is the one which user have enterend, x[0].password is the one we have found on the database, so we need to compare them with eachother
          bcrypt.compare(
            req.body.password,
            x[0].password,
            function (err, result) {
              if (result) {
                // console.log("password is valid")
                //IF YOU DON'T RESPOND HERE, YOUR SERVER WILL CRASH
                res.status(200).send("password is valid")
                ///user is valid and you can login
              } else {
                ///IT IS NECESSERY TO RESPOND HERE AS WELL, OTHERWISE WHEN YOU HAVE EMAIL IN YOUR DATABASE BUT THE ENTERED PASSWORD ISN'T EQUAL TO WHAT YOU HAVE SAVED IN THE DATABASE, SERVER WILL NOT RESPOND
                res.status(401).send("Email and Passwrod are wrong")
              }
            },
          )
        }
      })
  } else if (req.body.type === "signup") {
    console.log("Signup wanted")
    console.log(req.body)
    //In order to prevent signign up same two or more emails on our database, it is necessary to check if email exists on the database or it doesn't.
    address
      .find({ email: req.body.email })
      .exec()
      .then(function (foundedOne) {
        if (foundedOne.length > 0) {
          res.status(401).send("This email is used, try new one!")
        } else {
          //Trying to hash the password below
          bcrypt.hash(req.body.password, 10, function (err, hash) {
            //Saving Email and password to the database
            const newOne = new address({
              email: req.body.email,
              password: hash,
            })
            newOne.save()
            res.status(200).send("Account created")
          })
        }
      })
  } else {
    // type of signing is not valid, needs strict action
    res.status(404).send("Type of signing in invalid!!")
  }
})
//REMEMBER TO CHANGE THE PORT
app.listen(PORT, function () {
  console.log("EXPRESS LISTEN 3000")
})
