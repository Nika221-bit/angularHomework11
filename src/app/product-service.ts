import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products$ = new BehaviorSubject<Product[]>([
    { id: 1, name: 'Phone', category: 'electronics' },
    { id: 2, name: 'Shoes', category: 'fashion' }
  ]);

  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  addProduct(product: Product) {
    this.products$.next([...this.products$.getValue(), product]);
  }
}
