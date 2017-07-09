import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';

import 'rxjs/Rx';
import {Observable} from 'rxjs';

@Injectable()
export class TransmissionService {
  apiRoot:string = '/transmission/rpc/';

  constructor(private http: Http) { 

  }


  getSessionId(xSessionId:string) {
    let apiURL = this.apiRoot;

    let bodyString = JSON.stringify({method:"session-get"}); // Stringify payload
    let headers = new Headers(); // ... Set content type to JSON
    headers.append('Content-Type', 'application/json'); // also tried other types to test if its working with other types, but no luck
    headers.append('Authorization', 'Basic ' + btoa('vk:198600')); 
    if (xSessionId) {
      headers.append('X-Transmission-Session-Id', xSessionId);
    }
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(apiURL, bodyString, options )
      .map((res:Response) => {
        return res.json();
    });
  }

  getTorrents(xSessionId:string) {
    return this.sendTransmissionRequest(xSessionId, "torrent-get", {fields: ["id","addedDate","name","totalSize","error","errorString","eta","isFinished","isStalled","leftUntilDone","metadataPercentComplete","peersConnected","peersGettingFromUs","peersSendingToUs","percentDone","queuePosition","rateDownload","rateUpload","recheckProgress","seedRatioMode","seedRatioLimit","sizeWhenDone","status","trackers","downloadDir","uploadedEver","uploadRatio","webseedsSendingToUs"]});
  }
  getRecentlyActiveTorrents(xSessionId:string) {
    return this.sendTransmissionRequest(xSessionId, "torrent-get", {fields: ["id","addedDate","name","totalSize","error","errorString","eta","isFinished","isStalled","leftUntilDone","metadataPercentComplete","peersConnected","peersGettingFromUs","peersSendingToUs","percentDone","queuePosition","rateDownload","rateUpload","recheckProgress","seedRatioMode","seedRatioLimit","sizeWhenDone","status","trackers","downloadDir","uploadedEver","uploadRatio","webseedsSendingToUs"], ids: 'recently-active'});
  }
  stopTorrents(xSessionId:string, torrentsIds:Array<number>) {
    return this.sendTransmissionRequest(xSessionId, "torrent-stop", {ids: torrentsIds});
  }

  startTorrents(xSessionId:string, torrentsIds:Array<number>) {
    return this.sendTransmissionRequest(xSessionId, "torrent-start", {ids: torrentsIds});
  }

  deleteTorrents(xSessionId:string, torrentsIds:Array<number>, deleteData: boolean = false) {
    return this.sendTransmissionRequest(xSessionId, "torrent-remove", {'delete-local-data': deleteData, ids: torrentsIds});
  }

  sendTransmissionRequest(xSessionId: string, method: string, args: any = []) {
    let apiURL = this.apiRoot;

    let bodyString = JSON.stringify({method: method, arguments: args}); // Stringify payload
    let headers = new Headers(); // ... Set content type to JSON
    headers.append('Content-Type', 'application/json'); // also tried other types to test if its working with other types, but no luck
    headers.append('Authorization', 'Basic ' + btoa('vk:198600')); 
    headers.append('X-Transmission-Session-Id', xSessionId);

    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(apiURL, bodyString, options )
      .map((res:Response) => {
        return res.json();
    });
  }



}