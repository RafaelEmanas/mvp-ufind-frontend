import { Component, inject, output, signal, input } from '@angular/core';
import { ImageProcessingService } from '../../services/image-processing.service';
import { ToastService } from '../../services/toast.service';
import { MAX_FILE_SIZE_MB } from '../../constants/app.constants';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
})
export class ImageUpload {
  private imageService = inject(ImageProcessingService);
  private toastService = inject(ToastService);

  disabled = input<boolean>(false);
  required = input<boolean>(true);
  submitted = input<boolean>(false);

  fileSelected = output<File>();

  selectedImage = signal<File | null>(null);
  imagePreviewUrl = signal<string | null>(null);
  isProcessing = signal<boolean>(false);
  hasExistingImage = signal<boolean>(false);

  getFile(): File | null {
    return this.selectedImage();
  }
  
  getPreviewUrl(): string | null {
    return this.imagePreviewUrl();
  }
  
  setPreviewUrl(url: string | null) {
    this.imagePreviewUrl.set(url);
  }
  
  setAsExistingImage() {
    this.hasExistingImage.set(true);
  }
  
  reset() {
    this.selectedImage.set(null);
    this.imagePreviewUrl.set(null);
    this.hasExistingImage.set(false);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastService.show('O arquivo selecionado não é uma imagem válida.', 'error');
      input.value = '';
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      this.toastService.show(`O arquivo excede o tamanho máximo de ${MAX_FILE_SIZE_MB}MB.`, 'error');
      input.value = '';
      return;
    }

    this.isProcessing.set(true);

    this.imageService.compressImage(file)
      .then((compressedFile) => {
        this.selectedImage.set(compressedFile);
        this.fileSelected.emit(compressedFile);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviewUrl.set(e.target?.result as string);
        };
        reader.readAsDataURL(compressedFile);
      })
      .catch((error) => {
        this.toastService.show('Erro ao processar a imagem. Tente novamente.', 'error');
        console.error('Image compression error:', error);
      })
      .finally(() => {
        this.isProcessing.set(false);
      });
  }
}
