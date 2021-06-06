import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
  })
export class AuthGuard implements CanActivate {

    constructor(private acct : AuthenticationService,private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean>{
        console.log("can activate")
        return this.acct.isLoggedIn.pipe(take(1), map((loginStatus : boolean) => 
        {
              const destination: string  = state.url;
              const productId = route.params.id; 

            console.log(loginStatus)
            // To check if user is not logged in
            if(!loginStatus) 
            {
                this.router.navigate(['/login'], {queryParams: {returnUrl : state.url}});

                return false;
            }
            return true;

            // if the user is already logged in
                 
          
        }));

    }
}