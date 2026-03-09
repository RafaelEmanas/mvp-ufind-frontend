import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, catchError, of } from 'rxjs';

import { ItemService } from '../../services/item.service';
import { PageItem } from '../../types/api.helper';

@Component({
  selector: 'items-list-component',
  templateUrl: './home-items-list.html',
})
export class HomeItemsList {
  private itemService = inject(ItemService);

  searchQuery = input<string>('');

  currentPage = signal(0);
  error = signal(false);

  query$ = toObservable(
    computed(() => ({
      query: this.searchQuery().trim(),
      page: this.currentPage(),
    }))
  );

  private request$ = this.query$.pipe(
    switchMap(({ query, page }) => {
      this.error.set(false);

      const request = query
        ? this.itemService.searchItems(query, page)
        : this.itemService.getAllItems(page);

      return request.pipe(
        catchError(() => {
          this.error.set(true);
          return of(null);
        })
      );
    })
  );

  pageItem = toSignal<PageItem | null>(this.request$, { initialValue: null });

  items = computed(() => this.pageItem()?.content ?? []);

  nextPage() {
    if (this.pageItem()?.last) return;
    this.currentPage.update(p => p + 1);
  }

  previousPage() {
    if (this.pageItem()?.first) return;
    this.currentPage.update(p => p - 1);
  }
}