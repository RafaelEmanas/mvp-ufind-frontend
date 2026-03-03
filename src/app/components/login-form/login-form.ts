import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule],
  templateUrl: './login-form.html'
})
export class LoginForm {
  email = signal<string>('');
  password = signal<string>('');

  error = input<string | null>(null);
  loading = input<boolean>(false);
  formSubmit = output<{ email: string; password: string }>();

  onSubmit() {
    this.formSubmit.emit({
      email: this.email(),
      password: this.password()
    });
  }
}
