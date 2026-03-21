import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { PageItem, Item } from '../../types/api.helper';
import { Loading } from '../loading/loading';
import { Pagination } from '../pagination/pagination';
import { AdminItemCard } from '../admin-item-card/admin-item-card';
import { AdminSearchbar } from '../admin-searchbar/admin-searchbar';

@Component({
  selector: 'app-admin-items-list',
  imports: [Loading, Pagination, AdminItemCard, AdminSearchbar],
  templateUrl: './admin-items-list.html',
})
export class AdminItemsList {
  private itemService = inject(ItemService);

  pageItem = signal<PageItem | null>(null);
  items = computed(() => this.pageItem()?.content ?? []);
  loading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  currentPage = signal<number>(0);

  totalElements = computed(() => this.pageItem()?.totalElements ?? 0);
  totalPages = computed(() => this.pageItem()?.totalPages ?? 0);
  isFirstPage = computed(() => this.pageItem()?.first ?? true);
  isLastPage = computed(() => this.pageItem()?.last ?? true);
  isEmpty = computed(() => this.pageItem()?.empty ?? false);

  editItem = output<string>();
  deleteItem = output<string>();
  claimItem = output<string>();

  constructor() {
    this.loadItems();
  }

  loadItems(pageNumber: number = 0) {
    this.loading.set(true);
    this.hasError.set(false);

    this.itemService.getAllItems(pageNumber, 6).subscribe({
      next: (result) => {
        this.pageItem.set(result);
        this.currentPage.set(pageNumber);
        this.loading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.loading.set(false);
      },
    });
  }

  onPreviousPage() {
    if (this.isFirstPage()) return;
    this.loadItems(this.currentPage() - 1);
  }

  onNextPage() {
    if (this.isLastPage()) return;
    this.loadItems(this.currentPage() + 1);
  }

  onEditItem(itemId: string) {
    this.editItem.emit(itemId);
  }

  onDeleteItem(itemId: string) {
    this.deleteItem.emit(itemId);
  }

  onClaimItem(itemId: string) {
    this.claimItem.emit(itemId);
  }
}
