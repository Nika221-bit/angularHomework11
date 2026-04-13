import { Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail-component/product-detail-component';
import { ProductsListComponent } from './products-list-component/products-list-component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: '**', redirectTo: 'products' },
];
