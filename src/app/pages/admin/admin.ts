import { Component, signal, viewChild } from '@angular/core';
import { AdminItemForm } from '../../components/admin-item-form/item-form';
import { AdminItemsList } from '../../components/admin-items-list/admin-items-list';
import { ClaimItemModal } from '../../components/claim-item-modal/claim-item-modal';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-admin',
  imports: [AdminItemForm, AdminItemsList, ClaimItemModal, Header],
  templateUrl: './admin.html',
})
export class Admin {
  itemsList = viewChild(AdminItemsList);
  editingItemId = signal<string | null>(null);
  claimingItemId = signal<string | null>(null);

  onEditItem(itemId: string) {
    this.editingItemId.set(itemId);
  }

  onDeleteItem(itemId: string) {
    console.log('Delete item:', itemId);
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
