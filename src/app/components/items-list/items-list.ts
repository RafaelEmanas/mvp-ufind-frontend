import { Component, computed, inject, signal } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { PageItem } from '../../types/api.helper';
import { Loading } from '../loading/loading';
import { ItemsListError } from '../items-list-error/items-list-error';
import { ItemsListEmpty } from '../items-list-empty/items-list-empty';
import { Pagination } from '../pagination/pagination';
import { ItemComponent } from '../item/item';

@Component({
  selector: 'items-list-component',
  imports: [Loading, ItemsListError, ItemsListEmpty, Pagination, ItemComponent],
  templateUrl: './items-list.html'
})
export class ItemsList {

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
      }
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