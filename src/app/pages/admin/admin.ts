import { Component } from '@angular/core';
import { AdminItemForm } from '../../components/admin-item-form/item-form';
import { AdminItemsList } from '../../components/admin-items-list/admin-items-list';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-admin',
  imports: [AdminItemForm, AdminItemsList, Header],
  templateUrl: './admin.html',
})
export class Admin {
  onEditItem(itemId: string) {
    console.log('Edit item:', itemId);
  }

  onDeleteItem(itemId: string) {
    console.log('Delete item:', itemId);
  }
}
