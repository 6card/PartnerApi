import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';

import 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import {Observable} from 'rxjs';

import { Media, Channel } from '../shared/media';

@Injectable()
export class PartnerService {
  xSessionId:string = 'YkS0pJJb7UOAhnQQtmnO3Ug1BGBNKPWnyCgOETd27UKDlwKlMrxMUpLFjnU63mga0';
  loginName:string = 'NameTest';
  apiRoot:string = 'https://api.newstube.ru/dev';

  constructor(private http: Http) { 
 
  }

  getMediasCount(sessionId: string, channelId: any) {
    let apiURL = this.apiRoot+'/Media/ImportMediasPageCount';
    let params: URLSearchParams = new URLSearchParams();

    params.set('sessionId', sessionId);
    params.set('channelId', channelId);

    return this.http.get(apiURL, {search: params} )
      .map((res:Response) => {
        return res.json();
    }).catch(this.handleError);
  }

  getMedias(sessionId: string, channelId: any, startItem: any, countItems: any) {
    let apiURL = this.apiRoot+'/Media/ImportMediasPage';
    let params: URLSearchParams = new URLSearchParams();

    params.set('sessionId', sessionId);
    params.set('channelId', channelId);
    params.set('start', startItem);
    params.set('length', countItems);

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
        return res.json();
    }).catch(this.handleError);
  }

  addMedia(sessionId: any, media: Media): Observable<any> {
    let apiURL = this.apiRoot+'/Media/MediaAdd';
    let headers = new Headers(); // ... Set content type to JSON
    headers.append('Content-Type', 'application/json'); // also tried other types to test if its working with other types, but no luck
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers }); // Create a request option


    return this.http.post(apiURL, JSON.stringify({ SessionId: sessionId, Data: media }), options )
      .map((res:Response) => {
        return res.json();
    }).catch(this.handleError);
  }
//mediaId сделать обязательным!!!
  updateMedia(sessionId: any, media: Media): Observable<any> {
    let apiURL = this.apiRoot+'/Media/MediaUpdate';
    let headers = new Headers(); // ... Set content type to JSON
    headers.append('Content-Type', 'application/json'); // also tried other types to test if its working with other types, but no luck
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers }); // Create a request option


    return this.http.post(apiURL, JSON.stringify({ SessionId: sessionId, Data: media }), options )
      .map((res:Response) => {
        return res.json();
    }).catch(this.handleError);
  }

  blockMedia(sessionId: any, mediaId: any, externalId: any): Observable<any> {
    let apiURL = this.apiRoot+'/Media/MediaBlock';
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });


    return this.http.post(apiURL, JSON.stringify({ SessionId: sessionId, MediaId: mediaId, ExternalId: externalId }), options )
      .map((res:Response) => {
        return res.json();
    }).catch(this.handleError);
  }

  unblockMedia(sessionId: any, mediaId: any, externalId: any): Observable<any> {
    let apiURL = this.apiRoot+'/Media/MediaUnblock';
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });


    return this.http.post(apiURL, JSON.stringify({ SessionId: sessionId, MediaId: mediaId, ExternalId: externalId }), options )
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