import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { IdLinkService } from '../id-link.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {
  MatAutocompleteModule,
  MatHeaderCell,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';

@Component({
  selector: 'app-manager-portal',
  templateUrl: './manager-portal.component.html',
  styleUrls: ['./manager-portal.component.css']
})
export class ManagerPortalComponent implements OnInit {

  public result: CatDetails[] = [];
  public obs: Object[] = [];
  public data: string = null;
  public user: string = '';
  selectedRow: number;
  selectedResource: string[];
  edit: boolean;

  constructor(private route: ActivatedRoute, private http: HttpClient, private linkService: IdLinkService, private location: Location) { }


  ngOnInit() {
    this.user = this.route.snapshot.params.user;
    this.getName()
    this.result = [];
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
    console.log("Selected Resource Approved: ", selectedItem.URL); // You get the Id of the selected item here
  }

  onSelectEdit(selectedItem: any) {
    console.log("Selected Resource Edited: ", selectedItem.URL); // You get the Id of the selected item here
    this.edit = true;
  }

  getCatDetails(user: string): boolean {
    this.http.get('http://127.0.0.1:3300/getCatDetails/' + user).subscribe(data => {
      this.obs = data["response"];
      for (let i: number = 0; i < this.obs.length; i++) {
        let c: CatDetails = new CatDetails();
        c.setCategory(this.obs[i]["Category"]);
        c.setLastReviewBy(this.obs[i]["LastReviewBy"]);
        c.setType(this.obs[i]["Type"]);
        c.setURL(this.obs[i]["URL"]);
        c.setUser(this.obs[i]["User"]);
        //let x: number = this.obs[i]["CategoryID"];
        //console.log("x=" + x);
        //let cat: string = this.getCategory(x);
        //console.log("cat=" + cat);
        //c.setCategory(cat);
        this.result[i] = c;
      }
      console.log(this.result);
    });
  
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
