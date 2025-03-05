import { Component, OnInit } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isMobileMenuOpen = false;
  isAnimating = false;
  showHeader = false;
  isAuthenticated = false;

  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService) {}

  ngOnInit() {
    this.authService.authState$.subscribe(
      (isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
      }
    );
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showHeader = !event.url.includes('/auth/');
    });
  }

  logout() {
    this.authService.logout();
    this.toastr.success('Logout realizado com sucesso! Volte logo!');
    this.router.navigate(['/auth/login']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}