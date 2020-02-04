module.exports = (User, passport, LocalStrategy, bcrypt) => {
  passport.use(
    "signup",
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {
        if (username.length > 10) {
          return done(null, false, "username is more than 10 characters");
        } else if (
          !req.body.email.includes("@") ||
          req.body.email.charAt(0) == "@" ||
          req.body.email.charAt(req.body.email.length - 1) == "@"
        ) {
          // simple check for email
          return done(null, false, "Your Email isn't valid");
        }
        // check if usename already exists
        User.findOne({ username: username }, (err, user) => {
          if (err) return done(err);
          else if (user) return done(null, false, "username already exists");
          else {
            //check if email already exists
            User.findOne({ email: req.body.email }, (err, user) => {
              if (err) return done(err);
              else if (user) return done(null, false, "email already exists");
              else {
                // both email and username are unique, create a new user
                bcrypt.genSalt(10, (err, salt) => {
                  if (err) return done(err);
                  bcrypt.hash(password, salt, (err, hashedPassword) => {
                    if (err) return done(err);
                    new User({
                      username: username,
                      password: hashedPassword,
                      email: req.body.email,
                      animeList:[],
                      mangaList:[]
                    }).save((err, user) => {
                      if (err) return done(err);
                      else return done(null, user);
                    });
                  });
                });
              }
            });
          }
        });
      }
    )
  );
};
