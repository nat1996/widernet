import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { IdLinkService } from '../id-link.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  
  public usr: string;
  public pwd: string;
  public pwd2: string;
  public inDB: boolean;
  public match: boolean;
  public num: string;
  

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type' : 'application/json'
    })
  };

  constructor(private http: HttpClient, private linkService: IdLinkService, private route: Router) { }

  ngOnInit() {
    this.match = false;
    this.inDB = false;
  }


  setName(user: string): void {
    this.linkService.id = this.usr;
  }

  checkUserPass(user: string, pass: string): boolean {
    if(user == null || pass == null){
      alert("Invalid username or password");
      return;
    }
    this.http.get('http://127.0.0.1:3300/checkUserPass/' + user + "/" + pass).subscribe(data => {
      console.log("data " + data);
      this.match = data["response"][0]["count(*)"] === 1;
      console.log("match = " + this.match);
      if (this.match === false) {
        console.log("do not allow");
        alert("Invalid username or password");
      } else {
        console.log("allow");
        this.setName(user);
        this.route.navigate(['/userDetail/' + this.usr], {skipLocationChange: true});
      }
      
      return this.match;
    });
    return this.match;
  }
  manager(){
    this.route.navigate(['/managerLogin'], {skipLocationChange: true});
    
  }

  // allow(user: string, pwd1: string): boolean {
  //   this.http.get('http://127.0.0.1:3306/logins/' + user).subscribe(data => {
  //     console.log("data " + data);
  //     this.inDB = data["response"]["length"] !== 0;
  //     console.log("in db = " + this.inDB);
  //     this.checkUserPass(user, pwd1);
  //     console.log("match" + this.match);
  //     if (this.inDB && this.match) {
  //       console.log("allow")
  //       return true;
  //     } else {
  //       console.log("dont allow") 
  //       return false;
  //     }
  //   });
  //   return false;
    
   
    
  }



