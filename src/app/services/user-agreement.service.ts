import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router, NavigationStart } from '@angular/router';

import 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import {Observable} from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Agreement } from '../shared/agreement';
import { API_URLS } from '../config/api.config';


@Injectable()
export class UserAgreement {

  private subject = new Subject<Agreement>();
  private keepAfterRouteChange = false;

  apiRoot: string = API_URLS.ROOT;

  constructor(
    private router: Router,
    private http: Http
  ) { 
    // clear agreement on route change unless 'keepAfterRouteChange' flag is true
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
          if (this.keepAfterRouteChange) {
              // only keep for a single route change
              this.keepAfterRouteChange = false;
          } else {
              // clear agreement messages
              this.clear();
          }
      }
    });

  }

  add(agreement: Agreement, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next(agreement);
  }

  clear() {
    this.subject.next();
  }

  getAgreement(): Observable<any> {
    return this.subject.asObservable();
  }

  getAgreements(sessionId: string): Observable<Agreement[]> {
    const apiURL = `${this.apiRoot}${API_URLS.USER_GET_AGREEMENTS}`;

    let params: URLSearchParams = new URLSearchParams();
    params.set('sessionId', sessionId);

    return this.http.get(apiURL, {search: params} )
      .map((res:Response) => {
        return res.json();
    }).catch(this.handleError);
  }

  
  getFullAgreement(token: string): Observable<Agreement> {
    const apiURL = `${this.apiRoot}${API_URLS.USER_GET_AGREEMENT}`;

    let params: URLSearchParams = new URLSearchParams();
    params.set('token', token);

    return this.http.get(apiURL, {search: params} )
      .map((res:Response) => {
        return res.json();
    }).catch(this.handleError);
  }

  acceptAgreement(token: string) {
    const apiURL = `${this.apiRoot}${API_URLS.USER_ACCEPT_AGREEMENT}`;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });


    return this.http.post(apiURL, JSON.stringify({ token: token }), options )
      .map((res:Response) => {
        return res.json();
    }).catch(this.handleError);
  }
  

  private handleError(error: Response) {
      return Observable.throw(error.json().Message || 'Server error');
  }
}