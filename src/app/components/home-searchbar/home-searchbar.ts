import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'searchbar-component',
  imports: [],
  templateUrl: './home-searchbar.html',
})
export class HomeSearchbar {
  searchEvent = output<string>();
  searchQuery = signal<string>('');

  triggerSearch() {
    this.searchEvent.emit(this.searchQuery().trim());
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  onEnterKey(event: Event) {
    event.preventDefault();
    this.triggerSearch();
  }
}
