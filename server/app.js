if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");

//use cors
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// set static files folder
app.use(express.static("public"));
// set view engine
app.set("view engine", "ejs");
//use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//connect to database
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
//mongoose.set("debug", true);
const User = require("./models/User")(mongoose);
const Item = require("./models/Item")(mongoose);

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", () => {
  console.log("some error has happened with the database");
});
db.once("open", () => {
  console.log("database is connected");
});
//configure passport
require("./config/passport")(User, passport, bcrypt);
//set session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);
//initialize passport
app.use(passport.initialize());
app.use(passport.session());
// set different routes
//auth router
const authRouter = require("./routes/authRouter")(passport);
app.use("/auth", authRouter);
// password router
const passwordRouter = require("./routes/passwordRouter")(User);
app.use("/password", passwordRouter);
// user router
const userRouter = require("./routes/userRouter")(User);
app.use("/user", userRouter);
// item router
const itemRouter = require("./routes/itemRouter")(Item);
app.use("/item", itemRouter);

app.listen(process.env.PORT, () =>
  console.log(`app is listening on port ${process.env.PORT}`)
);
