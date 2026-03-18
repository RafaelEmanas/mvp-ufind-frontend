import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../endpoints';
import { PageItem, PresignedUploadResponse, RegisterItemRequest } from '../types/api.helper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  http = inject(HttpClient);
  private readonly MAX_FILE_SIZE_MB = 8;
  private readonly JPEG_QUALITY = 0.8;

  getAllItems(page: number = 0, size: number = 20): Observable<PageItem> {
    return this.http.get<PageItem>(API_ENDPOINTS.ITEM, {
      params: { page, size }
    });
  }

  searchItems(query: string, page: number = 0, size: number = 20): Observable<PageItem> {
    return this.http.get<PageItem>(`${API_ENDPOINTS.SEARCH}${query}`, {
      params: { page, size }
    });
  }

  getPresignedUrl(contentType: string): Observable<PresignedUploadResponse> {
    return this.http.get<PresignedUploadResponse>(`${API_ENDPOINTS.PRESIGNED_URL}${encodeURIComponent(contentType)}`);
  }

  uploadFile(file: File, uploadUrl: string): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': file.type
    });
    return this.http.put<void>(uploadUrl, file, { headers });
  }

  async compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const maxDimension = 1920;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            } else {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Compression failed'));
                return;
              }
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            },
            'image/jpeg',
            this.JPEG_QUALITY
          );
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  isFileSizeValid(file: File): boolean {
    const fileSizeMB = file.size / (1024 * 1024);
    return fileSizeMB <= this.MAX_FILE_SIZE_MB;
  }

  registerItem(itemData: RegisterItemRequest): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.ITEM, itemData);
  }
}

