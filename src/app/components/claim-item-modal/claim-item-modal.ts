import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { ToastService } from '../../services/toast.service';
import { MarkItemClaimedRequest } from '../../types/api.helper';
import { FormFieldError } from '../form-field-error/form-field-error';
import { isValidCollegeEmail, isValidCollegeId } from '../../utils/validators';
import { handleCollegeIdInput, handleCollegeIdKeyDown } from '../../utils/college-id-handler';

@Component({
  selector: 'app-claim-item-modal',
  imports: [FormsModule, FormFieldError],
  templateUrl: './claim-item-modal.html',
})
export class ClaimItemModal {
  private itemService = inject(ItemService);
  private toastService = inject(ToastService);

  itemId = input.required<string>();
  itemClaimed = output<void>();
  closeModal = output<void>();

  claimerName = signal<string>('');
  claimerEmail = signal<string>('');
  claimerCollegeId = signal<string>('');
  submitted = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  emailError = signal<string | null>(null);
  collegeIdError = signal<string | null>(null);

  isValidCollegeEmail = isValidCollegeEmail;
  isValidCollegeId = isValidCollegeId;

  onSubmit(form: NgForm) {
    this.submitted.set(true);
    this.emailError.set(null);
    this.collegeIdError.set(null);

    if (!this.isValidCollegeEmail(this.claimerEmail())) {
      this.emailError.set('Digite um email institucional válido (@icomp.ufam.edu.br ou @ufam.edu.br)');
    }

    if (!this.isValidCollegeId(this.claimerCollegeId())) {
      this.collegeIdError.set('A matrícula deve ter 8 dígitos');
    }

    if (form.valid && this.isValidCollegeEmail(this.claimerEmail()) && this.isValidCollegeId(this.claimerCollegeId())) {
      this.isSubmitting.set(true);

      const data: MarkItemClaimedRequest = {
        id: this.itemId(),
        claimerName: this.claimerName(),
        claimerEmail: this.claimerEmail(),
        claimerCollegeId: this.claimerCollegeId()
      };

      this.itemService.markItemAsClaimed(data).subscribe({
        next: () => {
          this.toastService.show('Item marcado como reivindicado com sucesso!', 'success');
          this.itemClaimed.emit();
        },
        error: (error: unknown) => {
          console.error('Claim error:', error);
          this.toastService.show('Erro ao marcar item como reivindicado. Tente novamente.', 'error');
          this.isSubmitting.set(false);
        }
      });
    }
  }

  close() {
    this.closeModal.emit();
  }

  onCollegeIdInput(event: Event) {
    this.collegeIdError.set(null);
    const input = event.target as HTMLInputElement;
    input.value = handleCollegeIdInput(input.value);
    this.claimerCollegeId.set(input.value);
  }

  onEmailInput() {
    this.emailError.set(null);
  }

  onCollegeIdKeyDown(event: KeyboardEvent) {
    handleCollegeIdKeyDown(event);
  }
}
