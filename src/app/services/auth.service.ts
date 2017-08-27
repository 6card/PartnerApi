// https://netbasal.com/angular-2-persist-your-login-status-with-behaviorsubject-45da9ec43243
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { API_URLS } from '../config/api.config';

import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class AuthService {
    apiRoot: string = API_URLS.ROOT;

    sessionId: string;
    username: string;
    public authenticated = new BehaviorSubject(null);

    constructor(private http: Http) {
        let lcstg = Cookie.get('currentUser');
        this.sessionId = lcstg ? JSON.parse(lcstg).token : null;
        if (this.sessionId)
            this.authenticated.next(true);
        this.username = lcstg ? JSON.parse(lcstg).username : null;
    }

    isLoggedIn() : Observable<boolean> {
        return this.authenticated.asObservable();
    }

    public isAuthenticated() {
        return this.sessionId ? true : false;
    }

    login(username: string, password: string): Observable<boolean> {
        let apiURL = this.apiRoot + API_URLS.AUTH_LOGIN;
        let headers = new Headers(); // ... Set content type to JSON
        headers.append('Content-Type', 'application/json'); // also tried other types to test if its working with other types, but no luck
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers }); // Create a request option

        return this.http.post(apiURL, JSON.stringify({ UserName: username, Password: password }), options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json()&& response.json().Data.SessionId;
                if (token) {
                    // set token property
                    this.sessionId = token;
                    this.username = username;
                    this.authenticated.next(true);
                    //console.log(this.sessionId);
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    Cookie.set('currentUser', JSON.stringify({ username: username, token: token }), 1);
 
                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }
 
    logout(): void {
        // clear token remove user from local storage to log user out
        this.sessionId = null;
        this.authenticated.next(false);
        Cookie.delete('currentUser');
    }

}