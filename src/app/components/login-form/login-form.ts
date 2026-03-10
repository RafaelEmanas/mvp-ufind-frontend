import { Component, input, output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { signal } from '@angular/core';
import { FormFieldError } from '../form-field-error/form-field-error';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, FormFieldError],
  templateUrl: './login-form.html'
})
export class LoginForm {
  email = signal<string>('');
  password = signal<string>('');
  submitted = signal<boolean>(false);

  error = input<string | null>(null);
  loading = input<boolean>(false);
  formSubmit = output<{ email: string; password: string }>();

  onSubmit(form: NgForm) {
    this.submitted.set(true);

    if (form.valid) {
      this.formSubmit.emit({
        email: this.email(),
        password: this.password()
      });
    }
  }
}
