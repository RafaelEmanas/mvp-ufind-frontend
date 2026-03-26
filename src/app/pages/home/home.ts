import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HomeSearchbar } from '../../components/home-searchbar/home-searchbar';
import { HomeItemsList } from '../../components/home-items-list/home-items-list';
import { Header } from '../../components/header/header';

@Component({
  selector: 'home-page',
  imports: [HomeSearchbar, HomeItemsList, Header],
  templateUrl: './home.html',
})
export class Home {
  private router = inject(Router);
  currentSearchQuery = signal<string>('');

  navigateToLogin() {
    this.router.navigate(['/admin']);
  }

  handleSearch(query: string) {
    this.currentSearchQuery.set(query);
  }
}
