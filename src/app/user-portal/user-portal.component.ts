import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
// import { CatDetails } from 'src/app/CatDetails';

import { IdLinkService } from '../id-link.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.css']
})
export class UserPortalComponent implements OnInit {

  public result: CatDetails[] = [];
  public result2: CatDetails[] = [];
  public obs: Object[] = [];
  public data: string = null;
  public user: string = '';
  t = false;

  uUp = false;
  tUp = false;
  approved = false;
  pending = false;
  edited = false;
  filter = 0;
  categoryFilter = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private linkService: IdLinkService, private location: Location, private router: Router) { }


  ngOnInit() {
    this.user = this.route.snapshot.params.user;
    this.getName()
    this.result = [];
    this.result2 = [];
    this.obs = [];
    console.log(this.user);
    this.getCatDetails(this.route.snapshot.params.user);
    console.log(this.result);
    this.data = null;
  }


  getName(): void {
    // TODO: send the message _after_ fetching the heroes
    const user = +this.route.snapshot.paramMap.get('user');
    
    this.user = this.linkService.getName();
        
  }
  filterCategory(f: string): void {
    this.result = this.result2;
    this.result = this.result2.filter(x => x.Category.toLowerCase().includes(f.toLowerCase()));
  }
  getCategory(id: number): string {
    this.http.get('http://127.0.0.1:3300/getCategory/' + id).subscribe(data => {
      console.log(data["response"][0]["Category"]);
      //return data["response"][0]["Category"];
      this.data = data["response"][0]["Category"];
      return this.data;
    });
    console.log(this.data);
    return this.data;
  }
 
  getCatDetails(user: string): boolean {
    let val: boolean = false;

    this.http.get('http://127.0.0.1:3300/getCatDetails/' + user).subscribe(data => {
      this.obs = data["response"];
      for (let i: number = 0; i < this.obs.length; i++) {
        val = false;
        for(let j: number = 0; j < this.result.length; j++) {
          if (this.result[j].getURL() === this.obs[i]["URL"]) {
            this.result[j].setCategory(this.result[j].getCategory() + ", " + this.obs[i]["Category"]);
            val = true;
          }
        }
        if(val === true) {
          continue;
        }
        let c: CatDetails = new CatDetails();
        c.setCategory(this.obs[i]["Category"]);
        c.setLastReviewBy(this.obs[i]["LastReviewBy"]);
        c.setType(this.obs[i]["Type"]);
        c.setURL(this.obs[i]["URL"]);
        c.setComments(this.obs[i]["Comments"]);
        c.setDate(this.obs[i]["LastEditDate"]);
        c.setshortDate(this.obs[i]["LastEditDate"]);

        //let x: number = this.obs[i]["CategoryID"];
        //console.log("x=" + x);
        //let cat: string = this.getCategory(x);
        //console.log("cat=" + cat);
        //c.setCategory(cat);
        this.result.push(c);
      }
    
      console.log(this.result);
    });
    this.result2 = this.result;
    return true;
  }

  filterStatus(a: boolean, p: boolean, e: boolean): void {
    if (a) {
      if (p) {
        if (e) {
          this.result = this.result2.filter(x => x.LastReviewBy.includes('approved') ||
          x.LastReviewBy.includes('pending') || x.LastReviewBy.includes('edit'));
        } else {
          this.result = this.result2.filter(x => x.LastReviewBy.includes('approved') ||
          x.LastReviewBy.includes('pending') && !x.LastReviewBy.includes('edit'));
        }
      } else {
        if (e) {
          this.result = this.result2.filter(x => x.LastReviewBy.includes('approved') &&
          !x.LastReviewBy.includes('pending') || x.LastReviewBy.includes('edit'));
        } else {
          this.result = this.result2.filter(x => x.LastReviewBy.includes('approved') &&
          !x.LastReviewBy.includes('pending') && !x.LastReviewBy.includes('edit'));
        }
      }
    } else {
      if (p) {
        if (e) {
          this.result = this.result2.filter(x => !x.LastReviewBy.includes('approved') ||
          x.LastReviewBy.includes('pending') || x.LastReviewBy.includes('edit'));
        } else {
          this.result = this.result2.filter(x => !x.LastReviewBy.includes('approved') &&
          x.LastReviewBy.includes('pending') && !x.LastReviewBy.includes('edit'));
        }
      } else {
        if (e) {
          this.result = this.result2.filter(x => !x.LastReviewBy.includes('approved') &&
          !x.LastReviewBy.includes('pending') || x.LastReviewBy.includes('edit'));
        } else {
          this.result = this.result2.filter(x => x.LastReviewBy.includes('approved') ||
          x.LastReviewBy.includes('pending') || x.LastReviewBy.includes('edit'));
        }
      }

    }
    // this.result = this.result2.filter(x => x.Status.includes(f));
  }

  logout(){
    this.router.navigate(['/login']);
    
  }
  reset(): void {
    this.result = this.result2;
  }

  sortType(asc: boolean): void {
    // tslint:disable-next-line:prefer-const
    let userUnsorted: Array<CatDetails> = this.result;
    let userSorted: Array<CatDetails> = this.result;
    this.t = !this.t;
    this.tUp = !this.tUp;
    if (asc) {
      // tslint:disable-next-line:prefer-const
      userSorted = userUnsorted.sort(this.typeCompareASC);
    } else {
      // tslint:disable-next-line:prefer-const
      userSorted = userUnsorted.sort(this.typeCompareDESC);
    }
    this.result = userSorted;

  }
private userCompareASC(a, b) {
  if (a.User.toLowerCase() < b.User.toLowerCase()) {
    return -1;
  }
  if (a.User.toLowerCase() > b.User.toLowerCase()) {
    return 1;
  }
  return 0;
  }
  
  private userCompareDESC(a, b) {
    if (a.User.toLowerCase() > b.User.toLowerCase()) {
    return -1;
    }
    if (a.User.toLowerCase() < b.User.toLowerCase()) {
    return 1;
    }
    return 0;
  }
  
  private resourceCompareASC(a, b) {
    if (a.URL.toLowerCase() < b.URL.toLowerCase()) {
    return -1;
    }
    if (a.URL.toLowerCase() > b.URL.toLowerCase()) {
    return 1;
    }
    return 0;
  }
  
  private resourceCompareDESC(a, b) {
    if (a.URL.toLowerCase() > b.URL.toLowerCase()) {
      return -1;
    }
    if (a.URL.toLowerCase() < b.URL.toLowerCase()) {
      return 1;
    }
    return 0;
    }
    
  private typeCompareASC(a, b) {
    if (a.Type.toLowerCase() < b.Type.toLowerCase()) {
     return -1;
    }
    if (a.Type.toLowerCase() > b.Type.toLowerCase()) {
     return 1;
    }
    return 0;
   }

   private typeCompareDESC(a, b) {
     if (a.Type.toLowerCase() > b.Type.toLowerCase()) {
      return -1;
     }
     if (a.Type.toLowerCase() < b.Type.toLowerCase()) {
      return 1;
     }
     return 0;
    }










}


class CatDetails {
  URL: string;
  LastReviewBy: string;
  CategoryID: number;
  Type: string;
  Category: string;
  Comments: string;
  Date: string;
  shortDate: string;

  public CatDetails() {
      this.URL = '';
      this.LastReviewBy = '';
      this.CategoryID = -1;
      this.Type = '';
      this.Category = '';
      this.Comments = '';
      this.Date = '';
      this.shortDate = '';
  }

  public getComments(): string {
      return this.Comments;
  }

  public setComments(comments: string): void {
      this.Comments = comments;
  }

  public getURL(): string {
      return this.URL;
  }

  public setURL(url: string): void {
      this.URL = url;
  }
  public getDate(): string {
    return this.Date;
  }

  public setDate(date: string): void {
    this.Date =  date;
    
  }
  public getshortDate(): string {
    return this.shortDate;
  }

  public setshortDate(date: string): void {
    this.shortDate = date.slice(0,10);
    var year = date.slice(0,4);
    var day = date.slice(5,7);
    var month = date.slice(8,10);
    this.shortDate = day + "-" + month + "-" + year;

  }

  public getLastReview(): string {
      return this.LastReviewBy;
  }

  public setLastReviewBy(LastReviewBy: string): void {
      this.LastReviewBy = LastReviewBy;
  }

  public getCategoryID(): number {
      return this.CategoryID;
  }

  public setCategoryID(id: number): void {
      this.CategoryID = id;
  }

  public getType(): string {
      return this.Type;
  }

  public setType(Types: string): void {
      this.Type = Types;
  }

  public getCategory(): string {
    return this.Category;
}

public setCategory(Category: string): void {
    this.Category = Category;
}

}
