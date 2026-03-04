import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../endpoints';
import { PageItem } from '../types/api.helper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  http = inject(HttpClient);

  getAllItems(page: number = 0, size: number = 20): Observable<PageItem> {
    return this.http.get<PageItem>(API_ENDPOINTS.ITEM, {
      params: { page, size }
    });
  }

}
