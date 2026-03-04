import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HomePageTitle } from '../../components/home-page-title/home-page-title';
import { HomeSearchbar } from '../../components/home-searchbar/home-searchbar';
import { HomeItemsList } from '../../components/home-items-list/home-items-list';
import { Header } from '../../components/header/header';

@Component({
  selector: 'home-page',
  imports: [HomePageTitle, HomeSearchbar, HomeItemsList, Header],
  templateUrl: './home.html',
})
export class Home {
  private router = inject(Router);

  navigateToLogin() {
    this.router.navigate(['/admin']);
  }
}
