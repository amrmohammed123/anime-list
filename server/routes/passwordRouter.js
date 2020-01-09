module.exports = User => {
  const express = require("express");
  const router = express.Router();
  const nodemailer = require("nodemailer");
  const crypto = require("crypto");
  const path = require("path");
  const bcrypt = require("bcryptjs");

  router.post("/forgot", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) res.status(500).send("");
      else if (!user) res.status(400).send("");
      else {
        // send email using nodemailer
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp-mail.outlook.com", // hostname
          auth: {
            user: process.env.EMAIL_USER, // generated ethereal user
            pass: process.env.EMAIL_PASS // generated ethereal password
          }
        });
        // send mail with defined transport object
        crypto.randomBytes(20, (err, buf) => {
          if (err) res.status(500).send("");
          else {
            let token = buf.toString("hex");
            User.updateOne(
              { email: req.body.email },
              {
                $set: {
                  resetToken: token,
                  resetTokenExpire: Date.now() + 3600000
                }
              },
              (err, user) => {
                if (err) res.status(500).send("");
                else {
                  let info = transporter.sendMail(
                    {
                      from: process.env.EMAIL_USER, // sender address
                      to: req.body.email, // list of receivers
                      subject: "reset password", // Subject line
                      text: `To reset your password click on the link below\n${process.env.SERVER_URL}/password/reset/${token}` // plain text body
                    },
                    (err, info) => {
                      if (err) res.status(500).send("");
                      else res.status(200).send("");
                    }
                  );
                }
              }
            );
          }
        });
      }
    });
  });
  router.get("/reset/:token", (req, res) => {
    // render reset password view
    res.render("reset-password", { token: req.params.token });
  });
  router.post("/reset/:token", (req, res) => {
    //check token and username if all valid reset password and send successful-rest.html otherwise send unsuccessful-reset.html
    User.findOne(
      {
        $and: [
          {
            username: req.body.username
          },
          { resetToken: req.params.token },
          { resetTokenExpire: { $gt: Date.now() } }
        ]
      },
      (err, user) => {
        if (err || !user)
          res.sendFile(
            path.join(__dirname, "..", "views", "unsuccessful-reset.html")
          );
        else {
          bcrypt.genSalt(10, (err, salt) => {
            if (err)
              res.sendFile(
                path.join(__dirname, "..", "views", "unsuccessful-reset.html")
              );
            else {
              bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
                User.updateOne(
                  { username: req.body.username },
                  {
                    $set: {
                      password: hashedPassword,
                      resetToken: "",
                      resetTokenExpire: null
                    }
                  },
                  (err, result) => {
                    if (err) {
                      res.sendFile(
                        path.join(
                          __dirname,
                          "..",
                          "views",
                          "unsuccessful-reset.html"
                        )
                      );
                    } else
                      res.sendFile(
                        path.join(
                          __dirname,
                          "..",
                          "views",
                          "successful-reset.html"
                        )
                      );
                  }
                );
              });
            }
          });
        }
      }
    );
  });
  return router;
};
