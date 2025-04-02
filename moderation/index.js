const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CourseCreated") {
    const status = data.subject.includes("computer") ? "rejected" : "approved";

    await axios
      .post("http://localhost:4005/events", {
        type: "CourseModerated",
        data: {
          id: data.id,
          subject: data.subject,
          studentId: data.studentId,
          status,
        },
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("Server listening on port 4003");
});
