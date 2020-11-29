const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");

const User = require('../models/User')

users.use(cors({ origin: "*" }));

process.env.SECRET_KEY = 'secret'

users.post('/register', (req, res) => {
  const userData = req.body;
  User.findOne({where: {email: req.body.email}})
  .then(user => {
    if (!user) {
      sendMail(userData);
      User.create(userData)
      .then(user => {
        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
          expiresIn: 1440
        })
        res.json({ token: token })
      })
      .catch(err => {
        res.status(404).json(err)
      })
    } else {
        res.status(404).json('User already registered on this mail.')
    }
  })
})

function sendMail(userData){
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "rushirgadekar@gmail.com",
      pass: "7083310314"
    }
  });
  let mailOptions = {
    from: "rushirgadekar@gmail.com",
    to: userData.email,
    subject: "NexTech Services Pvt Ltd.",
    html: `Hello <strong>${userData.name}</strong> we welcome you.
    <br>Your NexTech username & password is find below.
    <br><br>
    Username: ${userData.email}
    <br>
    Password: ${userData.password}
    <br><br><br><br>
    Thanks & Regards,<br>
    NexTech Services Pvt Ltd.`
  }
  transporter.sendMail(mailOptions);
}

users.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  })
    .then(user => {
      if (user) {
        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
          expiresIn: 1440
        })
        res.json({ token: token })
      } else {
        res.status(404).json('Username or Password error')
      }
    })
    .catch(err => {
      res.status(404).json(err)
    })
})

users.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  User.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.status(404).json('User not found')
      }
    })
    .catch(err => {
      res.status(404).json(err)
    })
})

module.exports = users
