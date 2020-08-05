const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { User } = require('./model/user');
const { auth } = require('./middleware/auth');

const port = process.env.PORT || 5000;

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true // added due to deprecation message
  })
  .then(() => console.log('DB connected'))
  .catch((error) => console.error(error));

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/api/user/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role
  });
});

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, data) => {
    if (err)
      return res.json({
        success: false,
        err
      });

    return res.status(200).json({
      success: true,
      userData: data
    });
  });
});

app.post('/api/user/login', (req, res) => {
  // finds the email
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email not found'
      });

    // compares the password
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: 'wrong password'
        });
      }
    });

    // generates token
    user.generateToken((error, user) => {
      if (err) return res.status(400).send(err);
      res.cookie('x_auth', user.token).status(200).json({
        loginSuccess: true
      });
    });
  });
});

app.post('/api/user/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, data) => {
    if (err) return res.json({ success: false, error: err });

    return res.status(200).send({
      sucess: true
    });
  });
});

app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
