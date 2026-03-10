import { Component, input } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
    @if (submitted() && control().invalid) {
      <div class="mt-1.5 p-2 rounded bg-red-50 border border-red-200">
        @for (error of errors(); track error) {
          <p class="text-sm text-red-600">{{ error }}</p>
        }
      </div>
    }
  `,
  standalone: true
})
export class FormFieldError {
  control = input.required<NgModel>();
  submitted = input.required<boolean>();

  errors(): string[] {
    const errs = this.control().errors;
    if (!errs) return [];

    const messages: string[] = [];
    const errorMap: Record<string, string> = {
      required: 'Este campo é obrigatório',
      maxlength: `Máximo de ${errs['maxlength']?.requiredLength} caracteres permitidos`,
      email: 'Digite um email válido'
    };

    for (const key of Object.keys(errs)) {
      messages.push(errorMap[key] || `Erro de validação: ${key}`);
    }

    return messages;
  }
}