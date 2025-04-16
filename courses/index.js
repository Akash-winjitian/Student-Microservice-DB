const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const coursesByStudentId = {};

app.get("/student/:id/course", (req, res) => {
  res.send(coursesByStudentId[req.params.id] || {});
});

app.post("/student/:id/course", async (req, res) => {
  const courseId = randomBytes(4).toString("hex");
  const { subject } = req.body;

  const course = coursesByStudentId[req.params.id] || [];

  course.push({ id: courseId, subject, status: "pending" });

  coursesByStudentId[req.params.id] = course;

  await axios
    .post("http://event-bus-srv:4005/events", {
      type: "CourseCreated",
      data: {
        id: courseId,
        subject,
        studentId: req.params.id,
        status: "pending",
      },
    })
    .catch((err) => {
      console.log(err.message);
    });

  res.status(201).send(course);
});

app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);

  const { type, data } = req.body;

  if (type === "CourseModerated") {
    const { studentId, id, status, subject } = data;

    const course = coursesByStudentId[studentId];

    const sub = course.find((sub) => {
      return sub.id === id;
    });
    sub.status = status;

    await axios.post("http://event-bus-srv:4005/events", {
      type: "CourseUpdated",
      data: {
        id,
        subject,
        studentId,
        status,
      },
    }).catch((err) => {
      console.log(err.message);
    });;
  }

  res.send({});
});

app.delete("/student/:id/course", (req, res) => {});

app.patch("/student/:id/course", (req, res) => {});

app.listen(4001, () => {
  console.log("Server listening on port 4001");
});
