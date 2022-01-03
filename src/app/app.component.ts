import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  navLinks = [
    {
      label: 'Filter',
      link: './filter',
      index: 0,
    },
    {
      label: 'Search item',
      link: './search',
      index: 1,
    },
  ];
}
