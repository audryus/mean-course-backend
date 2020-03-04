const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Post = require("./model/post")

const app = express()

mongoose.connect("mongodb://aubay:AwXzSA5dVCq7S6Wq@192.168.56.3/node-angular"
    ,{ useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Connected to dataBase.")
        })
        .catch((err)=> {
            console.error("Erro to connect to database.", err)
        })

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
    next();
})

app.post('/api/post', (req, res, next) => {
    const post = req.body
    const postModel = new Post({
        title: post.title,
        content: post.content
    })
    postModel.save().then(savedData => {
        post.id = savedData._id
        res.status(201).json({
            message: "Sucess",
            posts: [post]
        })
    })
})

app.get('/api/post', (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: 'Post fetched sucess', 
            posts: documents
        })
    })
});

app.delete("/api/post/:id", (req, res, next) => {
    console.log("delete", req.params.id)
    Post.deleteOne({_id: req.params.id})
        .then(result => {
            res.status(200).json(result)
        })
})

module.exports = app;