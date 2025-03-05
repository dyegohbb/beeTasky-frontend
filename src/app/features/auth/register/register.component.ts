import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateUserRequest } from '../../../core/models/user.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerData = {
    username: '',
    password: '',
    email: ''
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    if (!this.registerData.username || !this.registerData.password || !this.registerData.email) {
      this.toastr.error('Por favor, preencha todos os campos');
      return;
    }

    this.userService.create(this.registerData)
      .pipe(
        switchMap(() => this.authService.login({ login: this.registerData.username, password: this.registerData.password }))
      )
      .subscribe({
        next: (response) => {
          if (response.content?.token) {
            this.authService.setToken(response.content.token);
            this.toastr.success('Usuário registrado com sucesso!');
            this.router.navigate(['/home']);
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error?.message || 'Erro ao registrar usuário. Tente novamente mais tarde.';
          this.toastr.error(errorMessage);
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

}
