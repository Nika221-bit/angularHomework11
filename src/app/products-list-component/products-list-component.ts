import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, Subject, debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs';
import { Product, ProductService } from '../product-service';

@Component({
  standalone: true,
  selector: 'app-products-list-component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products-list-component.html',
  styleUrls: ['./products-list-component.scss'],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products$!: Observable<Product[]>;
  searchQuery$!: Observable<string>;
  selectedCategory$!: Observable<string>;
  loading$ = new BehaviorSubject<boolean>(false);

  newProductName = '';
  newProductCategory = '';

  private searchInput$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ProductService
  ) {}

  ngOnInit() {
    this.searchQuery$ = this.route.queryParams.pipe(map(params => params['search'] ?? ''));
    this.selectedCategory$ = this.route.queryParams.pipe(map(params => params['category'] ?? ''));

    this.products$ = this.route.queryParams.pipe(
      tap(() => this.loading$.next(true)),
      switchMap(params => this.service.getProducts().pipe(
        map(products => {
          let filtered = products;
          if (params['search']) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(params['search'].toLowerCase()));
          }
          if (params['category']) {
            filtered = filtered.filter(p => p.category === params['category']);
          }
          return filtered;
        })
      )),
      tap(() => this.loading$.next(false))
    );

    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(search => this.updateQueryParams({ search: search || null })),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(value: string) {
    this.searchInput$.next(value.trim());
  }

  setCategory(category: string) {
    this.updateQueryParams({ category: category || null });
  }

  onAddProduct() {
    const name = this.newProductName.trim();
    const category = this.newProductCategory.trim();

    if (!name || !category) {
      return;
    }

    const nextId = Date.now();
    this.service.addProduct({
      id: nextId,
      name,
      category
    });

    this.newProductName = '';
    this.newProductCategory = '';
  }

  private updateQueryParams(params: Record<string, string | null>) {
    const queryParams = { ...this.route.snapshot.queryParams };

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === '') {
        delete queryParams[key];
      } else {
        queryParams[key] = value;
      }
    });

    this.router.navigate(['/products'], { queryParams });
  }
}

