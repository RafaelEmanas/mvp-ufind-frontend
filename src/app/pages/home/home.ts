import { Component } from '@angular/core';
import { PageTitle } from "../../components/page-title/page-title";
import { Searchbar } from "../../components/searchbar/searchbar";
import { ItemsList } from "../../components/items-list/items-list";
import { Header } from "../../components/header/header";

@Component({
  selector: 'home-page',
  imports: [PageTitle, Searchbar, ItemsList, Header],
  templateUrl: './home.html'
})
export class Home {

}
