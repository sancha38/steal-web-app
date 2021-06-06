import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';


import { AlertService, AuthenticationService } from '../_services';

@Component({
    templateUrl: 'login.component.html',
styleUrls: ['./login.component.css']})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    Username :  FormControl;
    Password :  FormControl;
    returnUrl : string;
    ErrorMessage: string;
    invalidLogin: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) {}

    ngOnInit() {
        this.Username = new FormControl('', [Validators.required]);
        this.Password = new FormControl('', [Validators.required]);

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.loginForm = this.formBuilder.group({
            "Username" : this.Username,
            "Password" : this.Password
        });
        /*
        // reset login status
        this.authenticationService.logout();
        */

        
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() 
    {
        let userlogin = this.loginForm.value;
        if (this.loginForm.invalid) {
            return;
        }
        this.authenticationService.login(userlogin.Username, userlogin.Password).subscribe(result => {
            console.log("result ",result)
            let token = (<any>result).token;
            console.log(token);
            console.log(result.userRole);
            console.log("User Logged In Successfully");
            this.invalidLogin = false;
            console.log(this.returnUrl);
            this.router.navigateByUrl(this.returnUrl);
        
        },
        error => 
        {
            console.log("error")
            console.log(error)
            this.invalidLogin = true;

            this.ErrorMessage = error.error.loginError;

            console.log(this.ErrorMessage);
        })

    }





   
}
