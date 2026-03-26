import { Component, input, output } from '@angular/core';
import { Item } from '../../types/api.helper';
import { formatDate } from '../../utils/date-formatter';

@Component({
  selector: 'app-admin-item-card',
  imports: [],
  templateUrl: './admin-item-card.html'
})
export class AdminItemCard {
  item = input.required<Item>();
  edit = output<void>();
  delete = output<void>();
  claimItem = output<void>();

  formatDate = formatDate;

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  }

  onClaim() {
    this.claimItem.emit();
  }
}