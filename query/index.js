const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const students = {};

app.get('/student', (req, res) => {
    res.send(students);
})

app.post('/events', (req, res) => {
    const {type, data} = req.body;

    if(type === 'StudentCreated'){
        const {id, name} = data;

        students[id] = {id, name, course: []};
    }

    if(type === 'CourseCreated'){
        const {id, subject, studentId} = data;

        const student = students[studentId];
        student.course.push({id, subject});
    }
    console.log(students);

    res.send({});
})

app.listen(4002, () => {
    console.log("Server listening on port 4002");
})