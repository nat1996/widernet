import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.component.html',
  styleUrls: ['./register-login.component.css']
})

// export class RegisterForm{
//   constructor( 
//       public usr: string,
//       public pwd: string,
//       public pwd2: string
      

//   ){}
// }
export class RegisterLoginComponent implements OnInit {
  
  
  public usr: string;
  public pwd: string;
  public pwd2: string;
  public inDB: boolean;
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type' : 'application/json'
    })
  };

  constructor(private http: HttpClient, private route: Router) { }

  ngOnInit() {
    //this.insertUser('sydney', 'cole');
  }

  insertUser(user: string, pass: string) {
    this.http.post('http://127.0.0.1:3306/addUser/' + user + "/" + pass, this.httpOptions).subscribe(data => console.log(data));
    console.log("insert user");
  }

  allow(x: string, pwd1: string, pwd2: string): boolean {
    this.http.get('http://127.0.0.1:3306/logins/' + x).subscribe(data => {
      console.log("data " + data);
      this.inDB = data["response"]["length"] !== 0;
      if(this.inDB) {
        alert("There is already an account associated with this username.")
        if(true) {
          return false;
        }
      }
      else if (pwd1 === null || pwd2 === null || pwd1 !== pwd2) {
        alert("Passwords do not match, please try again.");
        console.log("dont allow")
        return false;
      } else {
        console.log("allow") 
  
        this.insertUser(this.usr, this.pwd);
        this.route.navigate(['/login']);
        return true;
      }
      
    })
    return false;
   
    
  }


}
