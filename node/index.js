const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./app/routes/Routes');
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true, useNewUrlParser: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://mongo:27017/test', { useNewUrlParser: true });

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log(req.query);
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use('/drivers', routes.driverRouter);
app.use('/deliveries', routes.deliveryRouter);
app.use('/clients', routes.clientRouter);
