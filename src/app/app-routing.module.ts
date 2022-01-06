import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilterComponent } from './components/filter/filter.component';
import { ItemSearchComponent } from './components/item-search/item-search.component';

const routes: Routes = [
  { path: 'filter', component: FilterComponent },
  { path: 'search', component: ItemSearchComponent },
  { path: '', pathMatch: 'full', redirectTo: 'filter' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
