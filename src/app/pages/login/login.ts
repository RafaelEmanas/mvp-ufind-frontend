import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginHeader } from '../../components/login-header/login-header';
import { LoginForm } from '../../components/login-form/login-form';

@Component({
  selector: 'app-admin-login',
  imports: [LoginHeader, LoginForm],
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  onSubmit(event: { email: string; password: string }) {
    this.loading.set(true);
    this.error.set(null);

    this.authService.login(event.email, event.password).subscribe({
      next: (result) => {
        this.loading.set(false);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Email ou senha inválidos');
      }
    });
  }
}
