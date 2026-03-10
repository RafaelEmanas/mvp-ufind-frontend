import { Component, output, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormFieldError } from '../form-field-error/form-field-error';

@Component({
  selector: 'app-item-form',
  imports: [FormsModule, FormFieldError],
  templateUrl: './item-form.html',
})
export class AdminItemForm {
  title = signal<string>('');
  description = signal<string>('');
  dateFound = signal<string>('');
  locationFound = signal<string>('');
  imageUrl = signal<string>('');
  contactInfo = signal<string>('');
  submitted = signal<boolean>(false);

  formSubmit = output<{
    title: string;
    description: string;
    dateFound: string;
    locationFound: string;
    imageUrl: string;
    contactInfo: string;
  }>();

  onSubmit(form: NgForm) {
    this.submitted.set(true);

    if (form.valid) {
      this.formSubmit.emit({
        title: this.title(),
        description: this.description(),
        dateFound: this.dateFound(),
        locationFound: this.locationFound(),
        imageUrl: this.imageUrl(),
        contactInfo: this.contactInfo()
      });
    }
  }
}