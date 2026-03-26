import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../endpoints';
import { Item, MarkItemClaimedRequest, PageItem, PresignedUploadResponse, RegisterItemRequest, UpdateItemRequest } from '../types/api.helper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private http = inject(HttpClient);

  getAllItems(page: number = 0, size: number = 20): Observable<PageItem> {
    return this.http.get<PageItem>(API_ENDPOINTS.ITEM(), {
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

  registerItem(itemData: RegisterItemRequest): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.ITEM(), itemData);
  }

  /**
   * Update an existing item
   * @param id - Item UUID
   * @param itemData - Item data to update
   * @returns Observable that completes on success
   * 
   * TODO: Backend implementation needed
   * - Create PATCH /api/item/{id} endpoint
   * - Define UpdateItemRequest DTO on backend (may differ from RegisterItemRequest)
   * - Consider: Should image updates be separate from item data updates?
   * - Consider: Should finder info be immutable after registration?
   */
  updateItem(id: string, itemData: UpdateItemRequest): Observable<void> {
    // TODO: Implement actual update endpoint on backend
    // For now, mock the update by returning success after a delay
    return new Observable<void>(observer => {
      setTimeout(() => {
        console.log('[MOCK] Update item:', id, itemData);
        console.warn('⚠️  Backend update endpoint not implemented yet!');
        observer.next();
        observer.complete();
      }, 500);
    });
  }

  getItemById(id: string): Observable<Item> {
    return this.http.get<Item>(API_ENDPOINTS.ITEM(id));
  }

  markItemAsClaimed(data: MarkItemClaimedRequest): Observable<void> {
    return this.http.patch<void>(API_ENDPOINTS.ITEM(), data);
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.ITEM(id));
  }
}

