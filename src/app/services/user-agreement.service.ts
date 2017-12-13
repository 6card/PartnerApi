import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';

import 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import {Observable} from 'rxjs/Observable';

import { API_URLS } from '../config/api.config';


@Injectable()
export class UserAgreement {

  apiRoot: string = API_URLS.ROOT;

  constructor(private http: Http) { 

  }

  getAgreements(sessionId: string) {
    const apiURL = `${this.apiRoot}${API_URLS.USER_GET_AGREEMENTS}`;

    let params: URLSearchParams = new URLSearchParams();
    params.set('sessionId', sessionId);

    return this.http.get(apiURL, {search: params} )
      .map((res:Response) => {
        return res.json().Data;
    }).catch(this.handleError);
  }

  getAgreement(token: string) {
    const apiURL = `${this.apiRoot}${API_URLS.USER_GET_AGREEMENT}`;

    let params: URLSearchParams = new URLSearchParams();
    params.set('token', token);

    return this.http.get(apiURL, {search: params} )
      .map((res:Response) => {
        return res.json();
    }).catch(this.handleError);
  }






  getMediasCount(sessionId: string, channelId: any, stateId: any, title: string) {
    let apiURL = this.apiRoot + API_URLS.MEDIA_MEDIAS_PAGE_COUNT;
    let params: URLSearchParams = new URLSearchParams();

    params.set('sessionId', sessionId);
    params.set('channelId', channelId);
    params.set('stateId', stateId);
    params.set('title', title);
    
    return this.http.get(apiURL, {search: params} )
      .map((res:Response) => {
        return res.json();
    }).catch(this.handleError);
  }

  getMedias(sessionId: string, channelId: any, startItem: any, countItems: any, stateId: any, title: string) {
    let apiURL = this.apiRoot + API_URLS.MEDIA_MEDIAS_PAGE;
    let params: URLSearchParams = new URLSearchParams();

    params.set('sessionId', sessionId);
    params.set('channelId', channelId);
    params.set('stateId', stateId);
    params.set('title', title);
    params.set('start', startItem);
    params.set('length', countItems);

    return this.http.get(apiURL, {search: params} )
      .map((res:Response) => {
        return res.json();
    }).catch(this.handleError);
  }


  getChannels(sessionId: any) {
    let apiURL = this.apiRoot + API_URLS.MEDIA_CHANNELS;
    let params: URLSearchParams = new URLSearchParams();

    params.set('sessionId', sessionId);

    return this.http.get(apiURL, {search: params} )
      .map((res:Response) => {
        return res.json();
    }).catch(this.handleError);
  }

  private handleError(error: Response) {
      //console.error(error);
      return Observable.throw(error.json().Message || 'Server error');
  }

}

// Success: false
// Id: 1
// Message: "Ошибка авторизации. Получите заново SessionId"