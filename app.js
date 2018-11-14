var http = require("http");
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport')
var LdapStrategy = require('passport-ldapauth');
var session = require('express-session');


const helmet = require('helmet')
var id = 800;


var connection = mysql.createConnection({
  host: '127.0.0.1',
  port: "9999",
  user: 'root',
  password: 'Unc#2019',
  database: 'widernet'
});

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected with mysql database...')
  })

app.use(cors());
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));









var dbserver = app.listen(3300, "127.0.0.1", function () {
 
    var host = dbserver.address().address
    var port = dbserver.address().port
   //"https://powerful-harbor-88011.herokuapp.com/" +
    console.log("Database app listening at http://%s:%s", host, port)
   
});






var OPTS = {
  server: {
    url: 'ldap://localhost:10389',
    bindDN: 'cn=root',
    bindCredentials: 'secret',
    searchBase: 'ou=Users',
    searchFilter: '(uid={{username}})'
  }
};
 
var app2 = express();
 
passport.use(new LdapStrategy(OPTS));
 
app2.use(bodyParser.json());
app2.use(bodyParser.urlencoded({extended: false}));
app2.use(passport.initialize());
 
// app2.post('/login', passport.authenticate('ldapauth', {session: false}), function(req, res) {
//   res.send({status: 'ok'});
// });
 
var ldapserver = app2.listen(4300, "127.0.0.1", function () {
 
  var host = ldapserver.address().address
  var port = ldapserver.address().port
 //"https://powerful-harbor-88011.herokuapp.com/" +
  console.log("LdapServer app listening at http://%s:%s", host, port)
 
});







// app.get('/hostid', function(req, res, next) {
// 	connection.query('select HostID from test.resourcepoints where ResourceID=16', function (error, results) {
//         if (error) throw error;
//   console.log(results);
//      res.end(JSON.stringify({"status": 200, "error": null, "response": results}));
//    });

// });

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

app.get('/logins/:user', function(req, res, next) {
  var user = req.params.user;
	connection.query("select * from test.logins where UserName=?", [user] , function (error, results) {
        //if (error) throw error;
  console.log(results);
     res.end(JSON.stringify({"status": 200, "error": null, "response": results}));
   });

});

app.get('/managerUsers/:user', function(req, res, next) {
  var user = req.params.user;
	connection.query("select UserName from test.logins where Manager=?", [user] , function (error, results) {
        //if (error) throw error;
  console.log(results);
     res.end(JSON.stringify({"status": 200, "error": null, "response": results}));
   });

});

app.post('/addUser/:user/:pass/:perm', function(req, res) {
  //var x = s4();
  var user = req.params.user;
  var pass = req.params.pass;
  var perm = req.params.perm;
  console.log("add user server");

	connection.query("insert into test.logins (UserID, UserName, Password, Name, Permissions) values (?,?,?, 'name', ?)", [Math.floor(100000000 + Math.random() * 900000000), user, pass, perm], function (error, results) {
        if (error) throw error;
  console.log(results);
     //res.send(user, pass);
   });
   id++;

});

app.post('/addEdit/:user/:resource/:type/:cat/:comment', function(req, res) {
  //var x = s4();
  var user = req.params.user;
  var resource = req.params.resource;
  var type = req.params.type;
  var cat = req.params.cat;
  var comment = req.params.comment;
  console.log("add edit to category");

	connection.query("update test.rp set LastReviewBy = 'edit', Mistyped = ?, Miscategorized = ?, Comments = ? where User = ? and URL = ?", [type, cat, comment, user, resource], function (error, results) {
        if (error) throw error;
  console.log(results);
     //res.send(user, pass);
   });
   id++;

});

app.post('/addApprove/:user/:resource/', function(req, res) {
  //var x = s4();
  var user = req.params.user;
  var resource = req.params.resource;
  console.log("add edit to category");

	connection.query("update test.rp set LastReviewBy = 'approved' where User = ? and URL = ?", [user, resource], function (error, results) {
        if (error) throw error;
  console.log(results);
     //res.send(user, pass);
   });
   id++;

});

app.get('/checkUserPass/:user/:pass', function(req, res, next) {
  var user = req.params.user;
  var pass = req.params.pass;
	connection.query("select count(*) from test.logins where UserName=? and Password=?", [user, pass] , function (error, results) {
        //if (error) throw error;
  console.log(results);
     res.end(JSON.stringify({"status": 200, "error": null, "response": results}));
   });

});
//eventually remove the limit of 5 in the following function
app.get('/getCatDetails/:user', function(req, res, next) {
  var user = req.params.user;
	connection.query("select R.Comments, R.User, R.URL, R.Type, R.LastReviewBy, C.Category from test.rp R inner join test.lkupegcategories C on R.CategoryID=C.eGCategoryID where User=? limit 5", [user] , function (error, results) {
        if (error) throw error;
  console.log(results);
     res.end(JSON.stringify({"status": 200, "error": null, "response": results}));
   });

});

app.get('/getCategory/:id', function(req, res, next) {
  var id = req.params.id;
	connection.query("select Category from test.lkupegcategories where eGCategoryID=?", [id] , function (error, results) {
        if (error) throw error;
  console.log(results);
     res.end(JSON.stringify({"status": 200, "error": null, "response": results}));
   });

});

//get catalog record data
app.get('/getCatRec/', function(req, res, next) {
  // var Manager = req.params.user;
	connection.query("select R.User, R.URL, R.Type, R.LastReviewBy, C.Category from test.rp R inner join test.lkupegcategories C on R.CategoryID=C.eGCategoryID where LastReviewBy='approved'", function (error, results) {
        if (error) throw error;
  console.log(results);
     res.end(JSON.stringify({"status": 200, "error": null, "response": results}));
   });

});
// var query = "select username from test.logins where username = " + uname + " for JSON Auto";
// connection.query(query, function (error, results) {
//     console.log(JSON.stringify(results));
//     if (error) throw error;
//     //res.end(JSON.stringify({"status": 200, "error": null, "response": results}));
//     if (JSON.stringify(results).includes(uname)){
//         alert("Username already exists");
//       }
// });
