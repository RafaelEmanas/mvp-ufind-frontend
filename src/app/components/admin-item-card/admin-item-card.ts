import { Component, input, output } from '@angular/core';
import { Item } from '../../types/api.helper';

@Component({
  selector: 'app-admin-item-card',
  imports: [],
  templateUrl: './admin-item-card.html'
})
export class AdminItemCard {
  item = input.required<Item>();
  edit = output<void>();
  delete = output<void>();

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  }
}