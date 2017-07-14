import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';

import 'rxjs/Rx';
import {Observable} from 'rxjs';

import { Media, Channel } from '../shared/media';

@Injectable()
export class PartnerService {
  xSessionId:string = 'YkS0pJJb7UOAhnQQtmnO3Ug1BGBNKPWnyCgOETd27UKDlwKlMrxMUpLFjnU63mga0';
  loginName:string = 'NameTest';
  apiRoot:string = 'https://api.newstube.ru/dev';

  constructor(private http: Http) { 
 
  }

  getMedias(sessionId: string) {
    let apiURL = this.apiRoot+'/Media/ImportMediasPage';
    let params: URLSearchParams = new URLSearchParams();

    params.set('sessionId', sessionId);
    params.set('channelId', '32703');
    params.set('start', '0');
    params.set('length', '50');

    return this.http.get(apiURL, {search: params} )
      .map((res:Response) => {
        return res.json();
    }).catch(this.handleError);
  }


  getChannels(sessionId: any) {
    let apiURL = this.apiRoot+'/Media/Channels';
    let params: URLSearchParams = new URLSearchParams();

    params.set('sessionId', sessionId);

    return this.http.get(apiURL, {search: params} )
      .map((res:Response) => {
        return res.json();
    }).catch(this.handleError);
  }

  getMedia(sessionId: any, mediaId: any, externalId: any): Observable<Media> {
    let apiURL = this.apiRoot+'/Media/GetMedia';
    let params: URLSearchParams = new URLSearchParams();

    params.set('sessionId', sessionId);
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