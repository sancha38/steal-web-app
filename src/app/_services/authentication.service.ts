import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";
//import { decode } from 'punycode';

@Injectable({
    providedIn: 'root'
  })  
export class AuthenticationService {
    constructor(private http: HttpClient, private router : Router) { }
  
    

    private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
    //private UserName    = new BehaviorSubject<string>(localStorage.getItem('username'));
    //private UserRole    = new BehaviorSubject<string>(localStorage.getItem('userRole'));

    get isLoggedIn() {
        return this.loginStatus.asObservable();
    }



    login(username: string, password: string) {
        //let baseuri = environment.origin+environment.api
        //let baseuri = "http://localhost:4000"
        console.log("login")
        let baseuri = environment.origin + environment.api;
        console.log(baseuri)
        return this.http.post<any>(`${baseuri}/users/authenticate`, { username: username, password: password })
            .pipe(map(result => {
                // login successful if there's a jwt token in the response
               console.log("result ",result);
               if(result && result.token) 
                {
                      // store user details and jwt token in local storage to keep user logged in between page refreshes

                    this.loginStatus.next(true);
                    localStorage.setItem('loginStatus', '1');
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('username', result.username);
                    localStorage.setItem('expiration', result.expiration);
                    localStorage.setItem('userRole', result.industry);
                    //this.UserName.next(localStorage.getItem('username'));
                    //this.UserRole.next(localStorage.getItem('userRole'));
                }

                 return result;
            }));
    }


    checkLoginStatus() : boolean 
    {
      
        var loginCookie = localStorage.getItem("loginStatus");

        if(loginCookie == "1") 
        {
            if(localStorage.getItem('token') === null || localStorage.getItem('token') === undefined) 
            {
                return false;
            }

             // Get and Decode the Token
             const token = localStorage.getItem('token');
             const decoded = jwt_decode(token);
            // Check if the cookie is valid
            console.log("decoded ",decoded)
            if(decoded.exp === undefined) 
            {
                return true;
            }

            // Get Current Date Time
            const date = new Date(0);

             // Convert EXp Time to UTC
            let tokenExpDate = date.setUTCSeconds(decoded.exp);

            // If Value of Token time greter than 

            if(tokenExpDate.valueOf() > new Date().valueOf()) 
            {
                return true;
            }

            console.log("NEW DATE " + new Date().valueOf());
            console.log("Token DATE " + tokenExpDate.valueOf());

            return false;
          
        }
        return false;
    }

    logout() {
        // remove user from local storage to log user out
        this.loginStatus.next(false);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        localStorage.removeItem('expiration');
        localStorage.setItem('loginStatus', '0');
        this.router.navigate(['/login']);
        console.log("Logged Out Successfully");
    }
}