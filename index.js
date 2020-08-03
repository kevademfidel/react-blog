const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const {
  User
} = require('./model/user');

const uri = 'mongodb+srv://KevFidel:rmpylk62nq@react-blog.yuxgh.mongodb.net/test?retryWrites=true&w=majority' // db location

mongoose
  .connect(uri, {
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

app.get('/', (req, res) => {
  res.json("hello world")
})


app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, data) => {
    if (err) return res.json({
      success: false,
      err
    });

    return res.status(200).json({
      success: true,
      data
    });
  });
});

app.listen(5000);