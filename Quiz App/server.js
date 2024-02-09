const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from 'public' directory

// MongoDB Atlas connection string
const uri =
  "mongodb+srv://subrat1192be21:rDajp8v4jY92AlLj@question.smrek5j.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB Atlas
MongoClient.connect(uri, (err, client) => {
  if (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
    return;
  }
  console.log("Connected to MongoDB Atlas");
  // Home page - Login/Signup
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/home.html"); // Serve home.html from 'public' directory
  });

  // Quiz page - Fetching one question at a time
  app.get("/quiz", (req, res) => {
    const questionsCollection = client.db("Quiz_App").collection("Questions");

    // Fetch 10 random questions from the database
    questionsCollection
      .aggregate([{ $sample: { size: 10 } }])
      .toArray((err, questions) => {
        if (err) {
          console.error("Error fetching questions:", err);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.json(questions); 
      });
  });

  // Result page
  app.get("/result", (req, res) => {
    const userAttemptsCollection = client.db("Quiz_App").collection("Attempts");

    // Fetch user's attempts from the database
    userAttemptsCollection.find({}).toArray((err, attempts) => {
      if (err) {
        console.error("Error fetching user attempts:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Calculate total score from all attempts
      const totalScore = attempts.reduce(
        (acc, attempt) => acc + attempt.score,
        0
      );

      // Display result with total score out of 10
      res.send(`Result: ${totalScore}/10`);
    });
  });

  // Signup route
  app.post("/signup", (req, res) => {
    const newUser = {
      name: req.body.name,
      age: req.body.age,
      contact_number: req.body.contact_number,
      gender: req.body.gender,
    };

    const usersCollection = client.db("Quiz_App").collection("Users");
    usersCollection.insertOne(newUser, (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.redirect("/"); // Redirect to home page after signup
    });
  });

  // Login route
  app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const usersCollection = client.db("Quiz_App").collection("Users");
    usersCollection.findOne(
      { name: username, password: password },
      (err, user) => {
        if (err) {
          console.error("Error finding user:", err);
          res.status(500).send("Internal Server Error");
          return;
        }

        if (!user) {
          res.status(404).send("User not found");
          return;
        }

        res.redirect("/quiz"); // Redirect to quiz page after successful login
      }
    );
  });

  // User attempts page
  app.get("/attempts", (req, res) => {
    const userAttemptsCollection = client.db("Quiz_App").collection("Attempts");

    // Fetch user's attempts from the database
    userAttemptsCollection.find({}).toArray((err, attempts) => {
      if (err) {
        console.error("Error fetching user attempts:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Display user's attempts
      res.json(attempts);
    });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
