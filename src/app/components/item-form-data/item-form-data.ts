import { Component, input, output, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormFieldError } from '../form-field-error/form-field-error';
import { isValidCollegeEmail, isValidCollegeId } from '../../utils/validators';
import { handleCollegeIdInput, handleCollegeIdKeyDown } from '../../utils/college-id-handler';

export interface FormData {
  title: string;
  description: string;
  dateFound: string;
  locationFound: string;
  finderName: string;
  finderEmail: string;
  finderCollegeId: string;
}

@Component({
  selector: 'app-item-form-data',
  imports: [FormsModule, FormFieldError],
  templateUrl: './item-form-data.html',
})
export class ItemFormData {
  title = signal<string>('');
  description = signal<string>('');
  dateFound = signal<string>('');
  locationFound = signal<string>('');
  finderName = signal<string>('');
  finderEmail = signal<string>('');
  finderCollegeId = signal<string>('');
  
  readOnly = input<boolean>(false);
  submitting = input<boolean>(false);
  submitted = input<boolean>(false);
  
  formSubmit = output<FormData>();
  
  isValidCollegeEmail = isValidCollegeEmail;
  isValidCollegeId = isValidCollegeId;
  
  getFormData(): FormData {
    return {
      title: this.title(),
      description: this.description(),
      dateFound: this.dateFound(),
      locationFound: this.locationFound(),
      finderName: this.finderName(),
      finderEmail: this.finderEmail(),
      finderCollegeId: this.finderCollegeId(),
    };
  }
  
  setFormData(data: FormData) {
    this.title.set(data.title);
    this.description.set(data.description);
    this.dateFound.set(data.dateFound);
    this.locationFound.set(data.locationFound);
    this.finderName.set(data.finderName);
    this.finderEmail.set(data.finderEmail);
    this.finderCollegeId.set(data.finderCollegeId);
  }
  
  reset() {
    this.title.set('');
    this.description.set('');
    this.dateFound.set('');
    this.locationFound.set('');
    this.finderName.set('');
    this.finderEmail.set('');
    this.finderCollegeId.set('');
  }
  
  onCollegeIdInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = handleCollegeIdInput(input.value);
    this.finderCollegeId.set(input.value);
  }
  
  onCollegeIdKeyDown(event: KeyboardEvent) {
    handleCollegeIdKeyDown(event);
  }
}
