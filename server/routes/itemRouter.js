module.exports = Item => {
  const express = require("express");
  const shortid = require("shortid");
  const router = express.Router();

  // write reviews
  router.post("/", (req, res) => {
    if (!req.isAuthenticated()) res.status(401).send("");
    else {
      Item.updateOne(
        { _id: req.body.path },
        {
          $push: {
            reviews: {
              author: req.user.username,
              likes: [],
              content: req.body.content,
              id: shortid.generate()
            }
          }
        },
        { upsert: true },
        (error, info) => {
          if (error) res.status(500).send("");
          else res.status(204).send("");
        }
      );
    }
  });
  // load reviews
  router.post("/reviews", (req, res) => {
    Item.findOne(
      { _id: req.body.path },
      { reviews: { $slice: [req.body.page, req.body.page + 10] } },
      (error, item) => {
        if (error) res.status(500).send("");
        else if (!item) res.json({});
        else {
          let reviews = [];
          for (let i in item.reviews) {
            reviews.push({
              author: item.reviews[i].author,
              likes: item.reviews[i].likes.length,
              content: item.reviews[i].content,
              id: item.reviews[i].id
            });
            if (
              req.isAuthenticated() &&
              item.reviews[i].likes.includes(req.user.username)
            ) {
              reviews[i].liked = true;
            } else reviews[i].liked = false;
          }
          res.json({ reviews });
        }
      }
    );
  });
  //handle reviews likes and unlikes
  router.post("/reviews/like", (req, res) => {
    if (!req.isAuthenticated()) res.status(401).send("");
    else {
      Item.findById(req.body.path, (error, item) => {
        let review = null;
        if (error) res.status(500).send("");
        else if (!item) res.status(400).send("");
        else {
          for (i in item.reviews) {
            if (item.reviews[i].id === req.body.id) {
              let usernameFound = false;
              // check if username exists remove it
              item.reviews[i].likes = item.reviews[i].likes.filter(element => {
                if (element === req.user.username) {
                  usernameFound = true;
                  return false;
                }
                return true;
              });
              // if username doesn't exist push it
              if (!usernameFound) item.reviews[i].likes.push(req.user.username);
              review = item.reviews[i];
            }
          }
          if (review) {
            Item.updateOne(
              { _id: req.body.path, "reviews.id": req.body.id },
              { $set: { "reviews.$": review } },
              (error, info) => {
                if (error) res.status(500).send("");
                else res.status(204).send("");
              }
            );
          }
        }
      });
    }
  });
  return router;
};
