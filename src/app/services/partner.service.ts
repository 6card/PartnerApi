import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';

import 'rxjs/Rx';
import {Observable} from 'rxjs';

import { Media } from '../shared/media';

@Injectable()
export class PartnerService {
  xSessionId:string = 'YkS0pJJb7UOAhnQQtmnO3Ug1BGBNKPWnyCgOETd27UKDlwKlMrxMUpLFjnU63mga0';
  loginName:string = 'NameTest';
  apiRoot:string = 'https://api.newstube.ru/dev';

  constructor(private http: Http) { 
 
  }


  getSessionId(value:any) {
    let apiURL = this.apiRoot+'/Auth/Login';
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

  getChannels() {
    let apiURL = this.apiRoot+'/Media/Channels';
    let params: URLSearchParams = new URLSearchParams();

    params.set('sessionId', this.xSessionId);
    return this.http.get(apiURL, {search: params} )
      .map((res:Response) => {
        return res.json();
    }).catch(this.handleError);
  }

  getMedia(mediaId: any, externalId: any): Observable<Media> {
    let apiURL = this.apiRoot+'/Media/GetMedia';
    let params: URLSearchParams = new URLSearchParams();

    params.set('sessionId', this.xSessionId);
    params.set('mediaId', mediaId);
    params.set('externalId', externalId);

    return this.http.get(apiURL, {search: params} )
      .map((res:Response) => {
        return res.json().Data;
    }).catch(this.handleError);
  }

  private handleError(error: Response) {
      // in a real world app, we may send the server to some remote logging infrastructure
      // instead of just logging it to the console
      console.error(error);
      return Observable.throw(error.json().error || 'Server error');
  }

}