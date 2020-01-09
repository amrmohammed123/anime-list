module.exports = passport => {
  const express = require("express");
  const router = express.Router();
  router.post("/signup", (req, res) => {
    passport.authenticate("signup", (err, user, info) => {
      if (err) {
        res.json({ error: "something went wrong on the server" });
        return;
      }
      if (!user) {
        res.json({ error: info });
        return;
      }
      req.login(user, err => {
        if (err) res.json({ error: "something went wrong on the server" });
        else res.json({ username: user.username, photo: user.photo });
      });
    })(req, res);
  });
  router.post("/login", (req, res) => {
    passport.authenticate("login", (err, user, info) => {
      if (err) {
        res.json({ error: "something went wrong on the server" });
        return;
      }
      if (!user) {
        res.json({ error: info });
        return;
      }
      req.login(user, err => {
        if (err) res.json({ error: "something went wrong on the server" });
        else res.json({ username: user.username, photo: user.photo });
      });
    })(req, res);
  });
  router.get("/logout", (req, res) => {
    req.logout();
    res.status(204).send("");
  });
  return router;
};
