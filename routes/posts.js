const express = require("express");
const router = express.Router();

const Post = require("../model/post");
const multer = require("multer");

const checkAuth = require("../middleware/check-auth")

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

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
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "-" + ext);
  }
});

var getPostModel = req => {
  const post = req.body;
  let postModel = new Post({
    title: post.title,
    content: post.content
  });
  if (post.id && post.id !== "null") {
    postModel._id = post.id;
  }
  if (req.file) {
    setImagePath(postModel, req);
  }

  if (req.userData) {
    postModel.creator = req.userData.userId;
  }

  return postModel;
};

var getUrl = req => {
  return req.protocol + "://" + req.get("host");
};

var setImagePath = (postModel, req) => {
  postModel.imagePath = getUrl(req) + "/images/" + req.file.filename;
};

router.post("", 
  checkAuth, 
  multer({ storage: storage }).single("image"), 
  (req, res, next) => {
    const post = req.body;
    const postModel = getPostModel(req);
    postModel.save().then(savedData => {
      post.id = savedData._id;
      res.status(201).json({
        message: "Sucess",
        posts: [post]
      });
    });
  }
);

router.patch("/:id", 
  checkAuth,
  multer({ storage: storage }).single("image"), 
  (req, res, next) => {
    const postModel = getPostModel(req);
    Post.updateOne({ _id: req.params.id, creator: postModel.creator }, postModel).then(result => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "ok" });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    });
  }
);

router.get("", (req, res, next) => {
  const query = Post.find();
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  if (pageSize && currentPage) {
    query
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  let fetchedDocuments;
  query.then(documents => {
    fetchedDocuments = documents;
    return Post.countDocuments();
  }).then(count => {
    res.status(200).json({
      message: "Post fetched sucess",
      posts: fetchedDocuments,
      count: count
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(document => {
    if (document) {
      res.status(200).json({
        message: "Post fetched sucess",
        posts: [document]
      });
    } else {
      res.status(404).json({ message: "Post not found." });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json(result);
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  });
});

module.exports = router;
