var express = require('express');
var path = require("path")
var badyParser = require('body-parser')
var app = express();
var mongoose = require('mongoose');
var mustacheExpress = require('mustache-express');
var moment = require('moment');

// adds mustache to end of file
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

// create application/x-www-form-urlencoded parser
var urlencodedParser = badyParser.urlencoded({ extended: false })

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/mydb';
mongoose.connect(mongoDB);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {

//Define a schema
var Schema = mongoose.Schema;

var timeReportSchema = new Schema({
    date: Date,
    minutes: Number,
    company: String,
    project: String
});

timeReportSchema.virtual('prettyDate').get(function () {
  // this is row of database date gives ugly date
  var date = moment(this.date);
  return date.format("dddd, MMMM Do YYYY");
});

// Compile model from schema
var TimeReports = mongoose.model('timereport', timeReportSchema );

app.use(express.static('public'));


app.get('/', function (req, res) {
   res.render('welcome');
})

app.get('/create', function (req, res) {
   res.render('create');
})

app.get('/calculate-total-minutes', function (req, res) {
  var totalminutes = 0;
  TimeReports.find(function (err, timeReports) {
    if (err) return handleError(err);
    for (var key in timeReports) {
      if (timeReports[key]["minutes"] != null) {
        totalminutes += timeReports[key]["minutes"];
      }
    }
    res.json({totalminutes : totalminutes})
  })
})

app.post('/create', urlencodedParser, function (req, res) {
  var insert = new TimeReports(req.body);
  //Save the new model instance, passing a callback
  insert.save(function (err) {
    if (err) return handleError(err);
    res.redirect('/timereports');
  });
})

app.get('/timereports', function (req, res) {
  TimeReports.find(function (err, timeReports) {
    if (err) return handleError(err);
    res.render('index', {entries1 : timeReports});
  })
})

app.delete('/timereports/:id', function (req, res) {
  TimeReports.remove({ _id: req.params.id }, function(err) {
    if(err) {
      console.log(err)
    }
    res.json({Removed : "Done"})
  });
})

var server = app.listen(80, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("App listening at http://%s:%s", host, port)

})
});
