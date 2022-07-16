const app = require('express')();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./app/routes/Routes');
const PORT = process.env.PORT || 3000;
const pug = require('pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


app.set('views', './app/views');
app.set('view engine', 'pug');

mongoose.connect('mongodb://mongo:27017/test', { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('Error connecting to MongoDB: ' + err);
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log(req.body);
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/app/views/index.html');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.set("json spaces", 2);
app.use('/drivers', routes.driverRouter);
app.use('/clients', routes.clientRouter);
app.use('/transports', routes.transportRouter);
app.use('/parcels', routes.parcelRouter);
