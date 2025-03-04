import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginRequest } from '../../../core/models/auth.model';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginData: LoginRequest = {
    login: '',
    password: ''
  };

  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService) {}

  onSubmit() {
    if (!this.loginData.login || !this.loginData.password) {
      this.toastr.error('Por favor, preencha todos os campos');
      return;
    }

    this.authService.login(this.loginData)
      .subscribe({
        next: (response) => {
          if (response.content?.token) {
            this.authService.setToken(response.content.token);        
            this.toastr.success('Login realizado com sucesso!');
            this.router.navigate(['/home']);
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            const errorMessage = error.error?.message || 'Usuário ou senha inválidos';
            this.toastr.error(errorMessage);
          } else {
            const errorMessage = error.error?.message || 'Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.';
            this.toastr.error(errorMessage);
          }
        }
      });
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
