import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdLinkService {


  id: string = '';
  constructor() { }

  public getName(): string {
    return this.id;
  }
 

}



