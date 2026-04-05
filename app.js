const express = require('express');

const app = express();

app.use(express.json());

let tasks = [
    { id: 1, title: "Learn JS", done: false },
]

app.get('/tasks', (rq, rs) => rs.json(tasks));

app.post('/tasks', (rq, rs) => {
    if (rq.body !== undefined && rq.body.title !== undefined) {
        const newTask = {
            id: tasks.length + 1,
            title: rq.body.title,
            done: false
        }

        tasks.push(newTask)
        rs.json({ "message": "Task created successfuly!", "result": newTask });
    } else {
        rs.json({ "error": "Task cannot be created! set 'title' value in Body" });
    }
})

app.delete('/tasks/:id', (rq, rs) => {
    const id = Number(rq.params.id)
    tasks = tasks.filter(task => task.id !== id)

    rs.json({ success: true })
})

app.patch('/tasks/:id', (rq, rs) => {
    const id = Number(rq.params.id)
    const value = Boolean(rq.body.done)
    for (let i in tasks) {
        if (tasks[i].id === id) {
            rs.json({ "message": "Task updated successfuly!", "result": tasks[i] });
            tasks[i].done = value
            break
        }
    }
})

app.listen(3000, () => { });