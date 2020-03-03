const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
    next();
})

app.post('/api/post', (req, res, next) => {
    const post = req.body
    if (post) {
        post.id = "id004"
    }
    console.log(post)
    res.status(201).json({
        message: "Sucess",
        posts: [post]
    })
})

app.get('/api/post', (req, res, next) => {
    const posts = [
        {id: "id001", title: "title 1", content: "new content 1"},
        {id: "id001", title: "title 2", content: "new content 2"},
        {id: "id003", title: "title 3", content: "new content 3"}
    ]
    res.status(200).json({
        message: 'Post fetched sucess',
        posts: posts
    })
});

module.exports = app;