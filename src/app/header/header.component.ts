import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.scss']}
)
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    console.log("ngOnInit header=====")
     this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  onLogout() {
    this.authService.logout();
  }
  getLoggedInIndustry(){
    let industry = localStorage.getItem('userRole');
    return industry ==="industry2"
  }
}