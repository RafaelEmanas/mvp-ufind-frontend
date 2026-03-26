import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-admin-searchbar',
  imports: [],
  templateUrl: './admin-searchbar.html',
})
export class AdminSearchbar {
  placeholder = input<string>('Pesquisar...');
  value = input<string>('');
  searchChange = output<string>();

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }
}
