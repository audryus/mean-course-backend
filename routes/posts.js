const express = require("express")
const router = express.Router()

const Post = require("../model/post")
const multer = require("multer");


const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("File format not supported.");
    if (isValid) {
      error = null;
    }
    cb(error, "./images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    console.log("saving image")
    cb(null, name + "-" + Date.now() + "-" + ext);
  }
});

var getPostModel = (post) => {
    return new Post({
        _id: post.id,
        title: post.title,
        content: post.content
    })
}

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
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

router.patch("/:id", (req, res, next) => {
    const postModel = getPostModel(req.body)
    Post.updateOne({_id: req.params.id}, postModel)
        .then(result => {
            res.status(200).json({message: 'ok'})
        })
})

router.get("", (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: 'Post fetched sucess', 
            posts: documents
        })
    })
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(document => {
        if (document) {
            res.status(200).json({
                message: 'Post fetched sucess', 
                posts: [document]
            })
        } else {
            res.status(404).json({ message: "Post not found."})
        }
    })
});

router.delete("/:id", (req, res, next) => {
    Post.deleteOne({_id: req.params.id})
        .then(result => {
            res.status(200).json(result)
        })
})

module.exports = router;