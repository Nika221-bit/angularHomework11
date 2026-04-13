import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Product, ProductService } from '../product-service';

@Component({
  standalone: true,
  selector: 'app-product-detail-component',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail-component.html',
  styleUrls: ['./product-detail-component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product$!: Observable<Product | undefined>;

  constructor(private route: ActivatedRoute, private service: ProductService) {}

  ngOnInit() {
    this.product$ = this.route.params.pipe(
      switchMap(params => this.service.getProductById(+params['id']))
    );
  }
}

