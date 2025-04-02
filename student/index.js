const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const student = {};

app.get("/student", (req, res) => {
  res.send(student);
});

app.post("/student", async (req, res) => {
  const id = randomBytes(4).toString("hex");

  const { name } = req.body;

  student[id] = {
    id,
    name,
  };

  await axios
    .post("http://localhost:4005/events", {
      type: "StudentCreated",
      data: {
        id,
        name,
      },
    })
    .catch((err) => {
      console.log(err.message);
    });

  res.status(201).send(student[id]);
});

app.post("/events", (req, res) => {
    console.log('Received Event', req.body.type);

    res.send({});
})

app.delete("/student", (req, res) => {});

app.patch("/student", (req, res) => {});

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
