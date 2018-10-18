
$('#registerbtn').onclick(function(){

    var uname = $("#usr").val();
    var pword = $("#pwd").val();
    var pword2 = $("#pwd2").val();

    if(uname == "" | pword == "" | pword2 == ""){
        alert("Username and Password are required.");
    }
    else if (pword !== pword2){
        alert("Passwords do not match.");
    }else{
        var query = "select username from test.logins where username = " + uname + " for JSON Auto";
            connection.query(query, function (error, results) {
                console.log(JSON.stringify(results));
                if (error) throw error;
                //res.end(JSON.stringify({"status": 200, "error": null, "response": results}));
                if (JSON.stringify(results).includes(uname)){
                    alert("Username already exists");
                  }
            });
    };

});










// const store = require('./store')

// app.post('/register', (req, res) => {
//     store
//       .register({
//         username: req.body.username,
//         password: req.body.password
//       })
//       .then(() => res.sendStatus(200))
//   })
//   app.listen(3000, "127.0.0.1", function() {
//     // var host = server.address().address
//     // var port = server.address().port
//     // console.log("Example app listening at http://%s:%s", host, port)
//     console.log("Server is listening at port 3000")
//   })

// const Register = document.querySelector('.register')
// Register.addEventListener('submit', (e) => {
//   e.preventDefault()
//   const username = Register.querySelector('.username').value
//   const password = Register.querySelector('.password').value
//   post('/register', { username, password })
// })
// function post (path, data) {
//   return window.fetch(path, {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   })
// }