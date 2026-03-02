import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
})
export class Pagination {
  pageNumber = input.required<number>();
  totalPages = input.required<number>();
  isFirst = input.required<boolean>();
  isLast = input.required<boolean>();

  previous = output<void>();
  next = output<void>();

  onPrevious() {
    this.previous.emit();
  }

  onNext() {
    this.next.emit();
  }
}