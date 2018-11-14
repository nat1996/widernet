import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdLinkService {


  id: string = '';
  user: string = '';
  resource: string = '';
  items: string[] = []
  constructor() { }

  public getItems(): string[] {
    return this.items;
  }

  public setItems(items: string[]): void {
    this.items = items;
  }

  public getName(): string {
    return this.id;
  }

  public getUser(): string{
   return this.user;
 } 

 public getResource(): string {
   return this.resource;
 }

 public setUser(user: string): void {
   this.user = user;
 }

 public setResource(resource: string): void {
   let x = resource.split("");
   let count = 0;
   for(let i = 0; i < x.length; i++) {
    if(x[i] === "/") {
      count++;
    }
   }
   for(let i = 0; i < count; i++) {
     resource = resource.replace("/", "%2F")
   }
   this.resource = resource;
 }

}



