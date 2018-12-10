import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { IdLinkService } from '../id-link.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import {MatPaginator, MatSort, MatTableDataSource, MatPaginatorModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ExportToCsv } from 'export-to-csv';


@Component({
  selector: 'app-manager-portal',
  templateUrl: './manager-portal.component.html',
  styleUrls: ['./manager-portal.component.css']
})
export class ManagerPortalComponent implements OnInit {

  public result: CatDetails[] = [];
  result2: CatDetails[] = [];
  public rows: Object[] = [];
  public obs: Object[] = [];
  public data: string = null;
  public user: string = '';
  issues: string[] = [];
  items: string[] = [];
  selectedRow: number;
  selectedResource: string[];
  edit: boolean;
  public comments = '';
  miscategorized: boolean = false;
  mistyped: boolean = false;
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type' : 'application/json'
    })
  };

  u = false;
  r = false;
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
    this.miscategorized = false;
    this.mistyped = false;
    this.issues = [];
    this.comments = '';
    //this.clickEvent();
    this.getName()
    this.result = [];
    this.result2 = [];
    this.obs = [];
    console.log(this.user);
    this.getCatDetails("natharris");
    console.log(this.result);
    this.data = null;
    this.selectedResource = [];
    this.edit = false;
  }


  getName(): void {
    // TODO: send the message _after_ fetching the heroes
    const user = +this.route.snapshot.paramMap.get('user');
    
    this.user = this.linkService.getName();
        
  }

  setClickedRow = function(index) {
    this.selectedRow = index;
  }

  getCategory(id: number): string {
    this.http.get('http://127.0.0.1:3300/managerUser/' + this.user).subscribe(data => {
      console.log("hello" + data);
    });

    this.http.get('http://127.0.0.1:3300/getCategory/' + id).subscribe(data => {
      console.log(data["response"][0]["Category"]);
      //return data["response"][0]["Category"];
      this.data = data["response"][0]["Category"];
      return this.data;
    });
    console.log(this.data);
    return this.data;
  }
 
  onSelectApprove(selectedItem: any) {
    this.linkService.setResource(selectedItem.URL);
    this.http.post('http://127.0.0.1:3300/addApprove/' + selectedItem.User + '/' + this.linkService.getResource(), this.httpOptions).subscribe( data => {
      console.log("send approve");
    })
    console.log("Selected Resource Approved: ", selectedItem.URL); // You get the Id of the selected item here
    
  }

  onSelectEdit(selectedItem: any) {
    console.log("Selected Resource Edited: ", selectedItem.URL); // You get the Id of the selected item here
    
    let x: string;
    x = selectedItem.Category;
    this.items = x.split(", ");
    this.linkService.setItems(this.items);
    if(this.edit == false){this.edit = true}
    else if(this.edit == true){this.edit = false};
    //Resets the comments to empty string
    this.comments = '';
    this.linkService.setResource(selectedItem.URL);
    this.linkService.setUser(selectedItem.User);
    console.log(this.issues);
    
  }

  sendEdit() {

    this.http.post('http://127.0.0.1:3300/addEdit/' + this.linkService.getUser() + '/' + this.linkService.getResource() + '/' + this.mistyped + '/' + this.miscategorized + '/' + this.comments, this.httpOptions).subscribe( data => {
      console.log("send edit");
    })
    this.mistyped = false;
    this.miscategorized = false;
    this.comments = '';
  }

  filterCategory(f: string): void {
    this.result = this.result2;
    this.result = this.result2.filter(x => x.Category.toLowerCase().includes(f.toLowerCase()));
  }

  reset(): void {
    this.result = this.result2;
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

  sortUser(asc: boolean): void {
    // tslint:disable-next-line:prefer-const
    let userUnsorted: Array<CatDetails> = this.result;
    let userSorted: Array<CatDetails> = this.result;
    this.u = !this.u;
    this.uUp = !this.uUp;
    if (asc) {
      // tslint:disable-next-line:prefer-const
      userSorted = userUnsorted.sort(this.userCompareASC);
    } else {
      // tslint:disable-next-line:prefer-const
      userSorted = userUnsorted.sort(this.userCompareDESC);
    }
    this.result = userSorted;

  }

  sortResource(asc: boolean): void {
    // tslint:disable-next-line:prefer-const
    let userUnsorted: Array<CatDetails> = this.result;
    let userSorted: Array<CatDetails> = this.result;
    this.r = !this.r;
    if (asc) {
      // tslint:disable-next-line:prefer-const
      userSorted = userUnsorted.sort(this.resourceCompareASC);
    } else {
      // tslint:disable-next-line:prefer-const
      userSorted = userUnsorted.sort(this.resourceCompareDESC);
    }
    this.result = userSorted;

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

  private dateCompare(a, b) {
    var aa = a.split('-').reverse().join(),
        bb = b.split('-').reverse().join();
    return aa < bb ? -1 : (aa > bb ? 1 : 0);
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


  title = 'eGranary';
  clickEvent(){
    console.log("click event triggered");
    this.user = this.route.snapshot.params.user;
    let resultlist :Object[] = [];
    let v = true;
    this.http.get('http://127.0.0.1:3300/managerUsers/'+ this.user).subscribe(data =>{
      //console.log(data);
      for(let j=0; j<data["response"].length;j++){
        // if(data["response"][j]["UserName"]=="" || data["response"][j]["UserName"]==""){
        //   continue;
        // }

        let fieldUsers = data["response"][j]["UserName"]
        let val: boolean = false;
        this.http.get('http://127.0.0.1:3300/getCatDetails/' + fieldUsers).subscribe(d =>{
          //console.log(d);
          
          if(d["response"].length != 0){
            console.log(d["response"]);
            

            this.rows = d["response"];
            for(let row of d["response"]){
              if(row["LastReviewBy"] == "approved"){
                resultlist = resultlist.concat(row);
              }
            };
            //resultlist = resultlist.concat(this.rows)
            console.log("rows: "+this.rows.length);
            console.log(data["response"].length);
            console.log(j);
            console.log(resultlist);
            



          }       



        });
        
        
      };

      
    });
    setTimeout(() => 
    {
      const options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
            showTitle: true,
            title: 'Catalog Records',
            useBom: true,
            useKeysAsHeaders: true,
            // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
          };
      //if(v){
        v= false;
        const csvExporter = new ExportToCsv(options);

        csvExporter.generateCsv(resultlist);
      console.log(resultlist);
      this.http.post('http://127.0.0.1:3300/addSent', this.httpOptions).subscribe( data => {
      console.log("send sent");
    })
    },
    1000);
 
    

    
               }




  getCatDetails(user: string): boolean {
    let val: boolean = false;
    this.http.get('http://127.0.0.1:3300/managerUsers/gb').subscribe(data => {
      for(let j = 0; j < data["response"].length; j++) {
        let fieldUsers = data["response"][j]["UserName"];
        this.http.get('http://127.0.0.1:3300/getCatDetails/' + fieldUsers).subscribe(d => {
          this.obs = d["response"];
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
            c.setUser(this.obs[i]["User"]);
            c.setDate(this.obs[i]["LastEditDate"]);
            c.setshortDate(this.obs[i]["LastEditDate"]);
            if (this.obs[i]["LastReviewBy"] != 'sent') {
              this.result.push(c);
            }
            
            //this.result[i] = c;
            //console.log("i=" + i);
            //console.log(c);
            //console.log(this.result.length);
          }
        });
      } 
    });
    this.result.sort(this.dateCompare);
    this.result2 = this.result;
    // this.http.get('http://127.0.0.1:3300/getCatDetails/' + user).subscribe(data => {
    //   this.obs = data["response"];
    //   for (let i: number = 0; i < this.obs.length; i++) {
    //     let c: CatDetails = new CatDetails();
    //     c.setCategory(this.obs[i]["Category"]);
    //     c.setLastReviewBy(this.obs[i]["LastReviewBy"]);
    //     c.setType(this.obs[i]["Type"]);
    //     c.setURL(this.obs[i]["URL"]);
    //     c.setUser(this.obs[i]["User"]);
    //     //let x: number = this.obs[i]["CategoryID"];
    //     //console.log("x=" + x);
    //     //let cat: string = this.getCategory(x);
    //     //console.log("cat=" + cat);
    //     //c.setCategory(cat);
    //     this.result[i] = c;
    //   }
    //   console.log(this.result);
    // });
  
    return true;
  }
  logout(){
    this.router.navigate(['/login'], {skipLocationChange: true});
    
  }

}


class CatDetails {
  URL: string;
  LastReviewBy: string;
  CategoryID: number;
  Type: string;
  Category: string;
  User: string;
  Date: string;
  shortDate: string;

  public CatDetails() {
      this.URL = '';
      this.LastReviewBy = '';
      this.CategoryID = -1;
      this.Type = '';
      this.Category = '';
      this.User = '';
      this.Date = '';
      this.shortDate = '';
  }

  public getUser(): string {
    return this.User;
  }

  public setUser(User: string): void {
    this.User = User;
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
