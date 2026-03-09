import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'searchbar-component',
  imports: [FormsModule],
  templateUrl: './home-searchbar.html',
})
export class HomeSearchbar {
  @Output() searchEvent = new EventEmitter<string>();
  searchQuery: string = '';

  triggerSearch() {
    this.searchEvent.emit(this.searchQuery.trim());
  }

  onEnterKey(event: Event) {
    event.preventDefault();
    this.triggerSearch();
  }
}
