module.exports = User => {
  const express = require("express");
  const router = express.Router();
  router.put("/list", (req, res) => {
    if (!req.isAuthenticated()) res.status(401).send("");
    else {
      if (req.body.action === "delete") {
        User.updateOne(
          { username: req.user.username },
          { $pull: { [`${req.body.type}List`]: { id: req.body.id } } },
          (error, info) => {
            if (error) res.status(500).send("");
            else res.status(204).send("");
          }
        );
      } else {
        User.updateOne(
          {
            username: req.user.username,
            [`${req.body.type}List.id`]:
              req.body.action === "add"
                ? { $ne: req.body.itemId }
                : req.body.itemId
          },
          {
            [req.body.action === "add" ? "$push" : "$set"]: {
              [req.body.action === "add"
                ? `${req.body.type}List`
                : `${req.body.type}List.$`]: {
                id: req.body.itemId,
                poster: req.body.poster,
                status: req.body.status,
                title: req.body.title
              }
            }
          },
          (error, info) => {
            if (error) res.status(500).send("");
            else res.status(204).send("");
          }
        );
      }
    }
  });
  router.get("/:username/list", (req, res) => {
    User.findOne({ username: req.params.username }, (error, user) => {
      if (error) res.status(500).send("");
      else
        return res.json({
          animeList: user.animeList,
          mangaList: user.mangaList
        });
    });
  });

  return router;
};
