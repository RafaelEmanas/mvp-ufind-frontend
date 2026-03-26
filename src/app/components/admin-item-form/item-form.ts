import { Component, inject, signal, input, output, viewChild, effect } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { ToastService } from '../../services/toast.service';
import { Item, PresignedUploadResponse, RegisterItemRequest, UpdateItemRequest } from '../../types/api.helper';
import { ImageUpload } from '../image-upload/image-upload';
import { ItemFormData, FormData as ItemFormDataInterface } from '../item-form-data/item-form-data';

@Component({
  selector: 'app-item-form',
  imports: [FormsModule, ImageUpload, ItemFormData],
  templateUrl: './item-form.html',
})
export class AdminItemForm {
  private itemService = inject(ItemService);
  private toastService = inject(ToastService);

  itemId = input<string | null>(null);
  itemRegistered = output<void>();

  isSubmitting = signal<boolean>(false);
  isLoadingItem = signal<boolean>(false);
  isReadOnly = signal<boolean>(false);
  submitted = signal<boolean>(false);
  itemStatus = signal<string>('');
  claimerName = signal<string>('');
  claimerEmail = signal<string>('');
  claimerCollegeId = signal<string>('');
  hasExistingImage = signal<boolean>(false);

  formData = viewChild<ItemFormData>('formData');
  imageUpload = viewChild<ImageUpload>('imageUpload');
  private isEditMode = false;

  private setFormDataFromItem(item: Item) {
    this.formData()!.setFormData({
      title: item.title || '',
      description: item.description || '',
      dateFound: item.dateFound || '',
      locationFound: item.locationFound || '',
      finderName: item.finderName || '',
      finderEmail: item.finderEmail || '',
      finderCollegeId: item.finderCollegeId || '',
    });
  }

  private setExistingImageFromItem(item: Item) {
    if (item.imageUrl) {
      this.imageUpload()!.setPreviewUrl(item.imageUrl);
      this.imageUpload()!.setAsExistingImage();
      this.hasExistingImage.set(true);
    }
  }

  private setClaimerDataFromItem(item: Item) {
    this.itemStatus.set(item.status || '');
    this.claimerName.set(item.claimerName || '');
    this.claimerEmail.set(item.claimerEmail || '');
    this.claimerCollegeId.set(item.claimerCollegeId || '');
    this.isReadOnly.set(item.status === 'CLAIMED');
  }

  constructor() {
    effect(() => {
      const id = this.itemId();
      if (id) {
        this.isEditMode = true;
        this.loadItemData(id);
      } else {
        this.isEditMode = false;
        this.hasExistingImage.set(false);
      }
    });
  }

  loadItemData(id: string) {
    this.isLoadingItem.set(true);

    this.itemService.getItemById(id).subscribe({
      next: (item: Item) => {
        this.setFormDataFromItem(item);
        this.setExistingImageFromItem(item);
        this.setClaimerDataFromItem(item);
        this.isLoadingItem.set(false);
      },
      error: (error) => {
        console.error('Error loading item:', error);
        this.toastService.show('Erro ao carregar item. Tente novamente.', 'error');
        this.isLoadingItem.set(false);
      }
    });
  }

  private validateFormData(form: NgForm): { formData: ItemFormDataInterface | null, selectedImage: File | null, isValid: boolean } {
    const formData = this.formData()?.getFormData() ?? null;
    const selectedImage = this.imageUpload()?.getFile() ?? null;

    if (!formData) {
      return { formData: null, selectedImage: null, isValid: false };
    }

    if (!this.isEditMode && !selectedImage) {
      return { formData, selectedImage: null, isValid: false };
    }

    if (!form.valid) {
      return { formData, selectedImage, isValid: false };
    }

    return { formData, selectedImage, isValid: true };
  }

  async onSubmit(form: NgForm) {
    this.submitted.set(true);

    const validation = this.validateFormData(form);
    if (!validation.isValid) {
      return;
    }

    const { formData, selectedImage } = validation;

    this.isSubmitting.set(true);

    try {
      const imageUrl = await this.handleImageUpload(selectedImage);
      if (!imageUrl) {
        this.toastService.show('Selecione uma imagem.', 'error');
        this.isSubmitting.set(false);
        return;
      }
      const itemData = this.buildItemData(formData!, imageUrl);
      this.handleFormSubmission(itemData, form, this.itemId());
    } catch (error) {
      console.error('Upload failed:', error);
      this.toastService.show('Erro ao enviar imagem. Tente novamente.', 'error');
      this.isSubmitting.set(false);
    }
  }

  private async handleImageUpload(selectedImage: File | null | undefined): Promise<string | null> {
    if (this.isEditMode && !selectedImage && this.hasExistingImage()) {
      return this.imageUpload()?.getPreviewUrl() || null;
    } else if (selectedImage) {
      return await this.uploadImage(selectedImage);
    } else {
      return null;
    }
  }

  private buildItemData(formData: ItemFormDataInterface, imageUrl: string): RegisterItemRequest {
    return {
      title: formData.title,
      description: formData.description,
      dateFound: formData.dateFound,
      locationFound: formData.locationFound,
      imageUrl: imageUrl,
      finderName: formData.finderName,
      finderEmail: formData.finderEmail,
      finderCollegeId: formData.finderCollegeId
    };
  }

  private handleFormSubmission(itemData: RegisterItemRequest, form: NgForm, editingId: string | null) {
    if (this.isEditMode && editingId) {
      // Update existing item - convert to UpdateItemRequest
      const updateData: UpdateItemRequest = {
        title: itemData.title,
        description: itemData.description,
        dateFound: itemData.dateFound,
        locationFound: itemData.locationFound,
        imageUrl: itemData.imageUrl,
        finderName: itemData.finderName,
        finderEmail: itemData.finderEmail,
        finderCollegeId: itemData.finderCollegeId
      };
      
      this.itemService.updateItem(editingId, updateData).subscribe({
        next: () => {
          this.toastService.show('Item atualizado com sucesso!', 'success');
          this.resetForm(form);
          this.itemRegistered.emit();
        },
        error: (error) => {
          console.error('Update error:', error);
          this.toastService.show('Erro ao atualizar item. Tente novamente.', 'error');
        },
        complete: () => {
          this.isSubmitting.set(false);
        }
      });
    } else {
      // Register new item
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
    }
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

  resetForm(form: NgForm) {
    form.resetForm();
    this.formData()!.reset();
    this.imageUpload()!.reset();
    this.itemStatus.set('');
    this.claimerName.set('');
    this.claimerEmail.set('');
    this.claimerCollegeId.set('');
    this.isReadOnly.set(false);
    this.submitted.set(false);
    this.isEditMode = false;
    this.hasExistingImage.set(false);
  }
}
