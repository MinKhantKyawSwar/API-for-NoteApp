exports.getPosts = (req, res, next) => {
  res.status(200).json([
    { id: 1, title: "First Post", description: "First post description pr." },
    { id: 2, title: "Second Post", description: "Second post description pr." },
  ]);
};

exports.createPost = (req, res, next) => {
  res.status(201).json([
    {
      message: "Post created.",
      data: req.body,
    },
  ]);
};
