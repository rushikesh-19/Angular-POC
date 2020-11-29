const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')

const nodemailer = require("nodemailer");

const User = require('../models/User')

users.use(cors({ origin: "*" }));

process.env.SECRET_KEY = 'secret'

users.post('/register', (req, res) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    birthDate: req.body.birthDate 
  }

  User.findOne({where: {email: req.body.email}})
  .then(user => {
    if (!user) {
      console.log(userData);

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "rushirgadekar@gmail.com",
          pass: "9503632001"
        }
      });
    
      let mailOptions = {
        from: "rushirgadekar@gmail.com", // sender address
        to: userData.email, // list of receivers
        subject: "NexTech Services Pvt Ltd.", // Subject line
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
    
      // send mail with defined transport object
      transporter.sendMail(mailOptions);
      
      User.create(userData)
      .then(user => {
        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
          expiresIn: 1440
        })
        res.json({ token: token })
      })
      .catch(err => {
        res.send('error: ' + err)
      })
    } else {
      res.status(401).send('User already registered');
    }
  })
})

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
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
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
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})






module.exports = users



/*User.findOne({
    where: {
      email: req.body.email
    }
  })
    //TODO bcrypt
    .then(user => {
      if (!user) {
        console.log(userData);
      
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "rushirgadekar@gmail.com",
      pass: "9503632001"
    }
  });

  let mailOptions = {
    from: "rushirgadekar@gmail.com", // sender address
    to: userData.email, // list of receivers
    subject: "NexTech Services Pvt Ltd.", // Subject line
    html: `Hello <strong>${userData.name}</strong> we welcome you. 
          <br>Your NexTech username & password is find below.
          <br><br>
            Username: ${userData.email}
            <br>
            Password: ${userData.password}
            

            <br><br><br><br>
            Thanks & Regards,
            NexTech Services Pvt Ltd.`
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
      
        User.create(userData)
          .then(user => {
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
              expiresIn: 1440
            })
            res.json({ token: token })
          })
          .catch(err => {
            res.send('error: ' + err)
          })
          
          
      } else {
        res.json({ error: 'User already exists' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
}) */