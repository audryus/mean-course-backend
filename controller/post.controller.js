const Post = require("../model/post.schema");

var getUrl = req => {
  return req.protocol + "://" + req.get("host");
};

var setImagePath = (postModel, req) => {
  postModel.imagePath = getUrl(req) + "/images/" + req.file.filename;
};

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

exports.create = (req, res, next) => {
  const post = req.body;
  const postModel = getPostModel(req);
  postModel
    .save()
    .then(savedData => {
      post.id = savedData._id;
      res.status(201).json({
        message: "Sucess",
        posts: [post]
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Failed to create new post."
      });
    });
};

exports.update = (req, res, next) => {
  const postModel = getPostModel(req);
  Post.updateOne({ _id: req.params.id, creator: postModel.creator }, postModel)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "ok" });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to update post" });
    });
};

exports.findAll = (req, res, next) => {
  const query = Post.find();
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  if (pageSize && currentPage) {
    query.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  let fetchedDocuments;
  query
    .then(documents => {
      fetchedDocuments = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Post fetched sucess",
        posts: fetchedDocuments,
        count: count
      });
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to fetch post" });
    });
};

exports.findById = (req, res, next) => {
  Post.findById(req.params.id)
    .then(document => {
      if (document) {
        res.status(200).json({
          message: "Post fetched sucess",
          posts: [document]
        });
      } else {
        res.status(404).json({ message: "Post not found." });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to fetch post" });
    });
};

exports.deleteByIdCreator = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json(result);
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to delete post" });
    });
};
