import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: AuthService, private ngZone: NgZone) {}

  ngOnInit() {
    this.ngZone.run(() => {
      this.isAuthenticated = this.authService.isAuthenticated();
    });
  }

}
