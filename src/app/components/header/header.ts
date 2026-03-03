import { Component, output } from '@angular/core';

@Component({
  selector: 'header-component',
  imports: [],
  templateUrl: './header.html'
})
export class Header {
  navigateToLogin = output<void>();
}

