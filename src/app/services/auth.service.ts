import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';

import 'rxjs/Rx';
import {Observable} from 'rxjs';

@Injectable()
export class AuthService {
    sessionId: string;
    username: string;
    

    constructor(private http: Http) {
        let lcstg = localStorage.getItem('currentUser');
        this.sessionId = lcstg ? JSON.parse(lcstg).token : null;
        this.username = lcstg ? JSON.parse(lcstg).username : null;
    }

    public isAuthenticated() {
        return this.sessionId ? true : false;
    }

    login(username: string, password: string): Observable<boolean> {
        let headers = new Headers(); // ... Set content type to JSON
        headers.append('Content-Type', 'application/json'); // also tried other types to test if its working with other types, but no luck
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers }); // Create a request option

        return this.http.post('https://api.newstube.ru/dev/Auth/Login', JSON.stringify({ UserName: username, Password: password }), options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json()&& response.json().Data.SessionId;
                if (token) {
                    // set token property
                    this.sessionId = token;
                    this.username = username;
                    
                    console.log(this.sessionId);
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
 
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
        localStorage.removeItem('currentUser');
    }

}