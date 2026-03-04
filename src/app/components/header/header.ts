import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'header-component',
  imports: [],
  templateUrl: './header.html',
})
export class Header {
  navigateToLogin = output<void>();
  showAdminButton = input<boolean>(true);
  private router = inject(Router);

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
