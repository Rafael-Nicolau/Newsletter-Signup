const express = require("express");
const app = express();
const port = 3000;
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => res.sendFile(__dirname + "/signup.html"));

app.post("/", function (req, res) {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  //console.log(firstName, lastName, email);

  const data = {
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

  const jsonData = JSON.stringify(data);

  const url = "https://usXX.api.mailchimp.com/3.0/lists/yourID";
  const options = {
    method: "POST",
    auth: "yourapiKEY"
  };

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });


  request.write(jsonData);
  request.end();
  //res.send("POST request to the homepage");

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`));


