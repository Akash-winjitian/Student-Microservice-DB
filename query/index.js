const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const students = {};

const handleEvent = (type, data) => {
    if(type === 'StudentCreated'){
        const {id, name} = data;

        students[id] = {id, name, course: []};
    }

    if(type === 'CourseCreated'){
        const {id, subject, studentId, status} = data;

        const student = students[studentId];
        student.course.push({id, subject, status});
    }

    if(type === 'CourseUpdated'){
        const {id, subject, studentId, status} = data;

        const student = students[studentId];
        const sub = student.course.find(sub => sub.id === id);

        sub.status = status;
        sub.course = subject;

    }
}

app.get('/student', (req, res) => {
    res.send(students);
})

app.post('/events', (req, res) => {
    const {type, data} = req.body;

    handleEvent(type, data);

    res.send({});
})

app.listen(4002, async () => {
    console.log("Server listening on port 4002");

        const res = await axios.get("http://event-bus-srv:4005/events");
     
        for (let event of res.data) {
          console.log("Processing event:", event.type);
     
          handleEvent(event.type, event.data);
        }
})