module.exports = (User, passport, LocalStrategy, bcrypt) => {
  passport.use(
    "login",
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) return done(err);
        else if (user) {
          bcrypt.compare(password, user.password, (err, res) => {
            if (err) return done(err);
            else if (res) {
              return done(null, user);
            } else {
              return done(null, false, "username or password is incorrect");
            }
          });
        } else {
          return done(null, false, "username or password is incorrect");
        }
      });
    })
  );
};
