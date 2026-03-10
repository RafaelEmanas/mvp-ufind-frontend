import { Component, computed, effect, inject, input, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ItemService } from '../../services/item.service';
import { PageItem } from '../../types/api.helper';
import { Loading } from '../loading/loading';
import { HomeItemsListError } from '../home-items-list-error/home-items-list-error';
import { HomeItemsListEmpty } from '../home-items-list-empty/home-items-list-empty';
import { Pagination } from '../pagination/pagination';
import { HomeItemCard } from '../home-item-card/home-item-card';

@Component({
  selector: 'items-list-component',
  imports: [Loading, HomeItemsListError, HomeItemsListEmpty, Pagination, HomeItemCard],
  templateUrl: './home-items-list.html',
})
export class HomeItemsList {
  private readonly itemService = inject(ItemService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchQuery = input<string>('');

  readonly pageItem = signal<PageItem | null>(null);
  readonly items = computed(() => this.pageItem()?.content ?? []);
  readonly loadingState = signal<boolean>(false);
  readonly error = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.searchQuery();
      this.loadItems(0);
    });
  }

  loadItems(pageNumber: number = 0): void {
    this.loadingState.set(true);
    this.error.set(false);

    const query = this.searchQuery().trim();
    const request$ = query
      ? this.itemService.searchItems(query, pageNumber)
      : this.itemService.getAllItems(pageNumber);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        this.pageItem.set(result);
        this.loadingState.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loadingState.set(false);
      },
    });
  }

  previousPage(): void {
    const page = this.pageItem();
    if (page && !page.first && page.number !== undefined) this.loadItems(page.number - 1);
  }

  nextPage(): void {
    const page = this.pageItem();
    if (page && !page.last && page.number !== undefined) this.loadItems(page.number + 1);
  }
}
