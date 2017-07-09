import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';

import 'rxjs/Rx';
import {Observable} from 'rxjs';

@Injectable()
export class PartnerService {
  xSessionId:string;
  loginName:string = 'NameTest';
  apiRoot:string = 'https://api.newstube.ru/v2/Auth/Login';

  constructor(private http: Http) { 

  }


  getSessionId(value:any) {
    let apiURL = this.apiRoot;
    let bodyString = JSON.stringify(value); // Stringify payload
    let headers = new Headers(); // ... Set content type to JSON
    headers.append('Content-Type', 'application/json'); // also tried other types to test if its working with other types, but no luck
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(apiURL, bodyString, options )
      .map((res:Response) => {
        return res.json();
    });
  }

}