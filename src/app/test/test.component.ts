import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { IdLinkService } from '../id-link.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import {MatPaginator, MatTableDataSource, MatPaginatorModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ExportToCsv } from 'export-to-csv';
import {MatSortModule, MatTableModule, MatSort, MatTable} from '@angular/material';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  public result: CatDetails[] = [];
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
  userSort: number = 0;
  resourceTypeSort: number = 0;
  statusSort: number = 0;
  columnsToDisplay = ['userName', 'category', 'resource', 'type', 'status'];

  constructor(private route: ActivatedRoute, private http: HttpClient, private linkService: IdLinkService, private location: Location) { }


  ngOnInit() {
    
    this.user = this.route.snapshot.params.user;
    this.miscategorized = false;
    this.mistyped = false;
    this.issues = [];
    this.comments = '';
    //this.clickEvent();
    this.getName()
    //this.result = [];
    this.obs = [];
    console.log(this.user);
    this.getCatDetails("natharris", 0, 0, 0);
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
    this.edit = true;
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


  title = 'eGranary';
  clickEvent(){
    console.log("click event triggered");
             
              this.http.get('http://127.0.0.1:3300/getCatDetails/natharris').subscribe(data => {
                  this.rows = data["response"];
                  console.log(this.rows);
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
                      const csvExporter = new ExportToCsv(options);
  
                  csvExporter.generateCsv(data["response"]);
                  alert("Catalog Record Saved Successfully");

              });
              // this.rows.push(data)
              var data2 = [
                {
                  User2: "Cataloger1"
                },
                {
                  User2: "Cataloger1"
                },
                {
                  User2: "Cataloger1"
                },
              ];
                console.log(data2);
                // //this.rows=data2;
                // const options = {
                //   fieldSeparator: ',',
                //   quoteStrings: '"',
                //   decimalseparator: '.',
                //   showLabels: true,
                //       showTitle: true,
                //       title: 'Catalog Records',
                //       useBom: true,
                //       useKeysAsHeaders: true,
                //       // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
                //     };
                //     const csvExporter = new ExportToCsv(options);

                    //csvExporter.generateCsv(data2);
                    
                    //alert(this.test);
               }




  getCatDetails(user: string, userSort: number, resourceTypeSort: number, statusSort: number): boolean {
    let val: boolean = false;
    let order: string = "";
    this.http.get('http://127.0.0.1:3300/managerUsers/gb').subscribe(data => {
      for(let j = 0; j < data["response"].length; j++) {
        let fieldUsers = data["response"][j]["UserName"];
        if(userSort !== 0) {
          if (userSort === 1) {
            order = "R.User";
          } else {
            order = "R.User DESC";
          }
        } else if (resourceTypeSort !== 0) {
          if (resourceTypeSort === 1) {
            order = "R.Type";
          } else {
            order = "R.Type DESC";
          }

        } else if (statusSort !== 0) {
          if (statusSort === 1) {
            order = "R.Status";
          } else {
            order = "R.Status DESC";
          }
          
        } else {
          order = "";
        }
        this.http.get('http://127.0.0.1:3300/getCatDetails/' + fieldUsers + "/" + order).subscribe(d => {
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
            this.result.push(c);
            //this.result[i] = c;
            //console.log("i=" + i);
            //console.log(c);
            //console.log(this.result.length);
          }
        });
      } 
    });




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

}


class CatDetails {
  URL: string;
  LastReviewBy: string;
  CategoryID: number;
  Type: string;
  Category: string;
  User: string;

  public CatDetails() {
      this.URL = '';
      this.LastReviewBy = '';
      this.CategoryID = -1;
      this.Type = '';
      this.Category = '';
      this.User = '';
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

