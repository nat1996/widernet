var http = require("http");
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport')
var LdapStrategy = require('passport-ldapauth');
var session = require('express-session');
var LdapAuth = require('ldapauth-fork');

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


// // ------------------------------------------------------START OF LDAP SERVER-----------------------------------------------------------

// // constructor(props) {
// //   super(props)
// //   this.state = { loggedin: false }
// //   this.login()
// // }


// var getLDAPConfiguration = function (req, callback) {
//   process.nextTick(function () {
//     var opts = {
//       server: {
//         url: 'ldap://localhost:10389',
//         bindDn: `uid=${req.params.user},Ou=Users`,
//         bindCredentials: `${req.params.pass}`,
//         searchBase: 'Ou=Users',
//         searchFilter: `uid=${req.params.user}`,
//         reconnect: true
//       }
//     };
//     callback(null, opts);
//   });
// };
// passport.serializeUser(function (user, done) {
//   done(null, user.uid)
// })
// passport.deserializeUser(function (id, done) {
//   User.findOne({ uid: id }).exec()
//     .then(user => {
//       if (!user) {
//         done(new Error(`Cannot find user with uid=${id}`))
//       } else {
//         done(null, user)
//       }
//     })
// })
// passport.myLogin = function (req, res, next) {
//   passport.authenticate('ldapauth', function (err, user, info) {
//     if (err) {
//       return next(err)
//     }
//     if (!user) {
//       res.status(401).json({ success: false, message: 'authentication failed' })
//     } else {
//       req.login(user, loginErr => {
//         if (loginErr) {
//           return next(loginErr);
//         }
//         User.findOneAndUpdate({uid: user.uid}, user, {upsert: true, new: true}).exec().then(user=> {
//           return res.json({ success: true, message: 'authentication succeeded', user: Object.assign({name: user.uid}, user) });
//         })
//       });
//     }
//   })(req, res, next)
// }
// login = (credentials) => {
//   if (credentials) {
//     var path = `${apiPath}/login`
//     var options = {
//       // have to have this to allow cookie to be sent to server. Therefore authentication session can be reserved.
//       credentials: 'same-origin',
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(credentials)
//     }
//   } else {
//     path = `${apiPath}/api/user`
//     options = { credentials: 'same-origin' }
//   }
//   fetch(path, options)
//     .then(response => {
//       if (response.status >= 200 && response.status < 300) {
//         return response.json()
//       } else {
//         var error = new Error(response.statusText)
//         error.response = response
//         throw error
//       }
//     })
//     .then(login => {
//       this.setState({ loggedin: login.success, user: login.user})
//     })
// }

// passport.use(new LdapStrategy(Opts)
//   function (user, done) {
//     winston.info("LDAP user ", user.displayName, "is logged in.")
//     return done(null, user);
//   })


// var OPTS = {
//   server: {
//      url: 'ldap://localhost:10389',
//     // bindDN: 'cn=root',
//     // bindCredentials: 'secret',
//     // searchBase: 'ou=Users',
//     // searchFilter: '(uid={{username}})'
//     bindDn: `uid=${req.body.username},Ou=Users`,
//     bindCredentials: `${req.body.password}`,
//     searchBase: 'Ou=Users',
//     searchFilter: `uid=${req.body.username}`,
//     reconnect: true
//   }
// };
 

 
// app2.post('/login', passport.authenticate('ldapauth', {session: false}), function(req, res) {
//   res.send({status: 'ok'});
// });
 
// // var ldapserver = app2.listen(4300, "127.0.0.1", function () {
 
// //   var host = ldapserver.address().address
// //   var port = ldapserver.address().port
// //  //"https://powerful-harbor-88011.herokuapp.com/" +
// //   console.log("LdapServer app listening at http://%s:%s", host, port)
 
// // });

// // --------------------------------------------------------END OF LDAP SERVER---------------------------------------------------------------------





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

app.post('/addSent', function(req, res) {
  console.log("add sent to category");

	connection.query("update test.rp set LastReviewBy = 'sent' where LastReviewBy = 'approved'", function (error, results) {
        if (error) throw error;
  console.log(results);
     //res.send(user, pass);
   });
   id++;

});
// This will be updated for LDAP BELOW ------------------------------------------------------------------------------
app.get('/checkUserPass/:user/:pass', function(req, res, next) {
  var user = req.params.user;
  var pass = req.params.pass;

  var app2 = express();
  var OPTS = {
    server: {
      url: 'ldap://localhost:10389',
      bindDN: 'dc=example, dc=com',
      bindCredentials: '' + pass + '',
      searchBase: 'ou=Users',
      searchFilter: '(uid='+user+')'
      //  url: 'ldap://localhost:10389',
      // // bindDN: 'cn=root',
      // // bindCredentials: 'secret',
      // // searchBase: 'ou=Users',
      // // searchFilter: '(uid={{username}})'
      // bindDn: `uid=${req.body.username},Ou=Users`,
      // bindCredentials: `${req.body.password}`,
      // searchBase: 'Ou=Users',
      // searchFilter: `uid=${req.body.username}`,
      // reconnect: true
    }
  };
  // app2.use(bodyParser.json());
  // app2.use(bodyParser.urlencoded({extended: false}));
  // app2.use(passport.initialize());
  // var ldapserver = app.listen(8080, "127.0.0.1", function () {
 
  //   var host = ldapserver.address().address
  //   var port = ldapserver.address().port
  //  //"https://powerful-harbor-88011.herokuapp.com/" +
  //   console.log("LDAP app listening at http://%s:%s", host, port)
   
  // });


  // passport.use(new LdapStrategy(OPTS));
  // console.log("about to try");
  // app2.post('/login', passport.authenticate('ldapauth', {session: false}), function(req, res) {
  //   console.log(res);
  //   res.end(JSON.stringify({"status": 200, "error": null, "response": res}));
  // });




	connection.query("select count(*) from test.logins where UserName=? and Password=?", [user, pass] , function (error, results) {
        if (error) throw error;
  console.log(results);
     res.end(JSON.stringify({"status": 200, "error": null, "response": results}));
   });

});
//eventually remove the limit of 5 in the following function
app.get('/getCatDetails/:user', function(req, res, next) {
  var user = req.params.user;
	connection.query("select R.Comments, R.User, R.URL, R.Type, R.LastReviewBy, R.LastEditDate, C.Category from test.rp R inner join test.lkupegcategories C on R.CategoryID=C.eGCategoryID where User=? order by R.LastEditDate desc limit 10", [user] , function (error, results) {
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
app.get('/getCatRec/:user', function(req, res, next) {
   var Manager = req.params.user;
	connection.query("select R.Comments, R.User, R.URL, R.Type, R.LastReviewBy, C.Category from test.rp R inner join test.lkupegcategories C on R.CategoryID=C.eGCategoryID where LastReviewBy='approved' and User=?", [Manager], function (error, results) {
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
