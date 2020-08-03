const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://KevFidel:rmpylk62nq@react-blog.yuxgh.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connected'))
  .catch(error => console.error(error))


app.get('/', (req, res) => (
  res.send('hello world')
));

app.listen(5000)