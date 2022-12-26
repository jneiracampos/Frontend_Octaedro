import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-headerAdmin',
  templateUrl: './headerAdmin.component.html',
  styleUrls: ['./headerAdmin.component.css']
})
export class HeaderAdminComponent implements OnInit {

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    //console.log("initialice component...");
    this.userIsAuthenticated = this.authService.getIsAuth();
    //console.log(this.userIsAuthenticated);
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    })
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }

}
