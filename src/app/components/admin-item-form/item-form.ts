import { Component, output, signal, inject, effect, input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormFieldError } from '../form-field-error/form-field-error';
import { ItemService } from '../../services/item.service';
import { ToastService } from '../../services/toast.service';
import { Item, PresignedUploadResponse, RegisterItemRequest } from '../../types/api.helper';

@Component({
  selector: 'app-item-form',
  imports: [FormsModule, FormFieldError],
  templateUrl: './item-form.html',
})
export class AdminItemForm {
  private itemService = inject(ItemService);
  private toastService = inject(ToastService);

  itemId = input<string | null>(null);

  title = signal<string>('');
  description = signal<string>('');
  dateFound = signal<string>('');
  locationFound = signal<string>('');
  finderName = signal<string>('');
  finderEmail = signal<string>('');
  finderCollegeId = signal<string>('');
  itemStatus = signal<string>('');
  claimerName = signal<string>('');
  claimerEmail = signal<string>('');
  claimerCollegeId = signal<string>('');
  isReadOnly = signal<boolean>(false);
  submitted = signal<boolean>(false);
  selectedImage = signal<File | null>(null);
  imagePreviewUrl = signal<string | null>(null);
  isProcessingImage = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  isLoadingItem = signal<boolean>(false);

  itemRegistered = output<void>();

  constructor() {
    effect(() => {
      const id = this.itemId();
      if (id) {
        this.loadItemData(id);
      }
    });
  }

  loadItemData(id: string) {
    this.isLoadingItem.set(true);

    this.itemService.getItemById(id).subscribe({
      next: (item: Item) => {
        this.title.set(item.title || '');
        this.description.set(item.description || '');
        this.dateFound.set(item.dateFound || '');
        this.locationFound.set(item.locationFound || '');
        this.finderName.set(item.finderName || '');
        this.finderEmail.set(item.finderEmail || '');
        this.finderCollegeId.set(item.finderCollegeId || '');
        this.itemStatus.set(item.status || '');
        this.claimerName.set(item.claimerName || '');
        this.claimerEmail.set(item.claimerEmail || '');
        this.claimerCollegeId.set(item.claimerCollegeId || '');
        this.imagePreviewUrl.set(item.imageUrl || null);
        this.isReadOnly.set(item.status === 'CLAIMED');
        this.isLoadingItem.set(false);
      },
      error: (error) => {
        console.error('Error loading item:', error);
        this.toastService.show('Erro ao carregar item. Tente novamente.', 'error');
        this.isLoadingItem.set(false);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastService.show('Por favor, selecione um arquivo de imagem válido.', 'error');
      input.value = '';
      return;
    }

    if (!this.itemService.isFileSizeValid(file)) {
      this.toastService.show('O arquivo excede o tamanho máximo de 8MB.', 'error');
      input.value = '';
      return;
    }

    this.isProcessingImage.set(true);

    this.itemService.compressImage(file)
      .then((compressedFile) => {
        this.selectedImage.set(compressedFile);
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviewUrl.set(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
        this.isProcessingImage.set(false);
      })
      .catch((error) => {
        console.error('Compression error:', error);
        this.toastService.show('Erro ao processar imagem. Tente novamente.', 'error');
        this.isProcessingImage.set(false);
        input.value = '';
      });
  }

  private uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.itemService.getPresignedUrl(file.type).subscribe({
        next: (response: PresignedUploadResponse) => {
          if (!response.uploadUrl || !response.imageUrl) {
            reject(new Error('Invalid presigned URL response'));
            return;
          }

          this.itemService.uploadFile(file, response.uploadUrl).subscribe({
            next: () => {
              resolve(response.imageUrl!);
            },
            error: (error) => {
              console.error('Upload error:', error);
              reject(error);
            }
          });
        },
        error: (error) => {
          console.error('Presigned URL error:', error);
          reject(error);
        }
      });
    });
  }

  async onSubmit(form: NgForm) {
    this.submitted.set(true);

    if (!this.selectedImage()) {
      return;
    }

    if (form.valid) {
      this.isSubmitting.set(true);

      try {
        const imageUrl = await this.uploadImage(this.selectedImage()!);
        
        const itemData: RegisterItemRequest = {
          title: this.title(),
          description: this.description(),
          dateFound: this.dateFound(),
          locationFound: this.locationFound(),
          imageUrl: imageUrl,
          finderName: this.finderName(),
          finderEmail: this.finderEmail(),
          finderCollegeId: this.finderCollegeId()
        };

        this.itemService.registerItem(itemData).subscribe({
          next: () => {
            this.toastService.show('Item cadastrado com sucesso!', 'success');
            this.resetForm(form);
            this.itemRegistered.emit();
          },
          error: (error) => {
            console.error('Registration error:', error);
            this.toastService.show('Erro ao cadastrar item. Tente novamente.', 'error');
          },
          complete: () => {
            this.isSubmitting.set(false);
          }
        });
      } catch (error) {
        console.error('Upload failed:', error);
        this.toastService.show('Erro ao enviar imagem. Tente novamente.', 'error');
        this.isSubmitting.set(false);
      }
    }
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.title.set('');
    this.description.set('');
    this.dateFound.set('');
    this.locationFound.set('');
    this.finderName.set('');
    this.finderEmail.set('');
    this.finderCollegeId.set('');
    this.itemStatus.set('');
    this.claimerName.set('');
    this.claimerEmail.set('');
    this.claimerCollegeId.set('');
    this.selectedImage.set(null);
    this.imagePreviewUrl.set(null);
    this.isReadOnly.set(false);
    this.submitted.set(false);
  }

  isValidCollegeEmail(email: string): boolean {
    return email.trim().toLowerCase().endsWith('@icomp.ufam.edu.br') || 
           email.trim().toLowerCase().endsWith('@ufam.edu.br');
  }

  isValidCollegeId(id: string): boolean {
    return id.length === 8;
  }

  onCollegeIdInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const numericValue = input.value.replace(/\D/g, '');
    const truncatedValue = numericValue.slice(0, 8);
    this.finderCollegeId.set(truncatedValue);
  }
}
