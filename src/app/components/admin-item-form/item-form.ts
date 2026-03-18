import { Component, output, signal, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormFieldError } from '../form-field-error/form-field-error';
import { ItemService } from '../../services/item.service';
import { ToastService } from '../../services/toast.service';
import { PresignedUploadResponse, RegisterItemRequest } from '../../types/api.helper';

@Component({
  selector: 'app-item-form',
  imports: [FormsModule, FormFieldError],
  templateUrl: './item-form.html',
})
export class AdminItemForm {
  private itemService = inject(ItemService);
  private toastService = inject(ToastService);

  title = signal<string>('');
  description = signal<string>('');
  dateFound = signal<string>('');
  locationFound = signal<string>('');
  contactInfo = signal<string>('');
  submitted = signal<boolean>(false);
  selectedImage = signal<File | null>(null);
  imagePreviewUrl = signal<string | null>(null);
  isProcessingImage = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  formSubmit = output<{
    title: string;
    description: string;
    dateFound: string;
    locationFound: string;
    imageUrl: string;
    contactInfo: string;
  }>();

  itemRegistered = output<void>();

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
          contactInfo: this.contactInfo() || undefined
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
    this.contactInfo.set('');
    this.selectedImage.set(null);
    this.imagePreviewUrl.set(null);
    this.submitted.set(false);
  }
}
