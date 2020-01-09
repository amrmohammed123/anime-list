module.exports = (User, passport, bcrypt) => {
  const LocalStrategy = require("passport-local").Strategy;
  //set signup strategy
  require("./passport-signup")(User, passport, LocalStrategy, bcrypt);
  //set login strategy
  require("./passport-login")(User, passport, LocalStrategy, bcrypt);
  //serialize , deserialize
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
