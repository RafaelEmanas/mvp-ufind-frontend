import { Component, inject, signal, viewChild } from '@angular/core';
import { AdminItemForm } from '../../components/admin-item-form/item-form';
import { AdminItemsList } from '../../components/admin-items-list/admin-items-list';
import { ClaimItemModal } from '../../components/claim-item-modal/claim-item-modal';
import { Header } from '../../components/header/header';
import { ItemService } from '../../services/item.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin',
  imports: [AdminItemForm, AdminItemsList, ClaimItemModal, Header],
  templateUrl: './admin.html',
})
export class Admin {
  private itemService = inject(ItemService);
  private toastService = inject(ToastService);

  itemsList = viewChild(AdminItemsList);
  editingItemId = signal<string | null>(null);
  claimingItemId = signal<string | null>(null);

  onEditItem(itemId: string) {
    this.editingItemId.set(itemId);
  }

  onDeleteItem(itemId: string) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      this.itemService.deleteItem(itemId).subscribe({
        next: () => {
          this.toastService.show('Item excluído com sucesso!', 'success');
          this.itemsList()?.loadItems();
        },
        error: () => {
          this.toastService.show('Erro ao excluir item. Tente novamente.', 'error');
        }
      });
    }
  }

  onItemRegistered() {
    this.editingItemId.set(null);
    this.itemsList()?.loadItems();
  }

  onClaimItem(itemId: string) {
    this.claimingItemId.set(itemId);
  }

  onItemClaimed() {
    this.claimingItemId.set(null);
    this.itemsList()?.loadItems();
  }

  onCloseClaimModal() {
    this.claimingItemId.set(null);
  }
}
