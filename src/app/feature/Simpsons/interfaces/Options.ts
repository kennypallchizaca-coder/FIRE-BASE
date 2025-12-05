import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Options {

  limit?: number;
  offset?: number;

}
