import { Component, input } from '@angular/core';
import { Item } from '../../types/api.helper';

@Component({
  selector: 'app-item',
  imports: [],
  templateUrl: './home-item-card.html',
})
export class HomeItemCard {
  item = input.required<Item>();

  formatDate(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('pt-BR');
  }

  badgeClass(status: string): string {
    return status === 'AVAILABLE'
      ? 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
      : 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
  }

  statusLabel(status: string): string {
    return status === 'AVAILABLE' ? 'Disponível' : 'Reivindicado';
  }
}
