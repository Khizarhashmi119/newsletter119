require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  var jsonData = JSON.stringify(data);
  var options = {
    url: "https://us4.api.mailchimp.com/3.0/lists/bb3f7367b5",
    method: "POST",
    headers: {
      Authorization: "khizar " + process.env.API_KEY
    },
    body: jsonData
  };
  request(options, function(error, response, body) {
    if (error) {
      console.log("error");
      res.sendFile(__dirname + "/failure.html");
    } else {
      console.log(response.statusCode);
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server has been started at port no. 3000");
});
