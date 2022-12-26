import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  envName = environment.name

  constructor(private authService: AuthService){}
  ngOnInit(){
    this.authService.autoAuthUser();
  }
}
