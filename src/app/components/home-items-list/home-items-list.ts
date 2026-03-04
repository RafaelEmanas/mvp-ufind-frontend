import { Component, computed, inject, signal } from '@angular/core';
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
  private itemService = inject(ItemService);

  pageItem = signal<PageItem | null>(null);
  items = computed(() => this.pageItem()?.content ?? []);
  loadingState = signal<boolean>(false);
  error = signal<boolean>(false);
  currentPage = signal<number>(0);

  constructor() {
    this.loadItems();
  }

  loadItems(pageNumber: number = 0) {
    this.loadingState.set(true);
    this.error.set(false);

    this.itemService.getAllItems(pageNumber).subscribe({
      next: (result) => {
        this.pageItem.set(result);
        this.currentPage.set(pageNumber);
        this.loadingState.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loadingState.set(false);
      },
    });
  }

  previousPage() {
    if (this.pageItem()?.first) return;
    this.loadItems(this.currentPage() - 1);
  }

  nextPage() {
    if (this.pageItem()?.last) return;
    this.loadItems(this.currentPage() + 1);
  }
}
