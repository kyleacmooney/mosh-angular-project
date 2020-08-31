import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from './../services/category.service';
import { ProductService } from './../services/product.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ShoppingCartService } from './../services/shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  categories$;
  products$;
  cart$: Observable<ShoppingCart>;
  selectedCategory: [string];
  subscription: Subscription;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: ShoppingCartService
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    this.cart$ = (await this.cartService.getCart());
    this.categories$ = this.categoryService.getAll();
    this.products$ = this.productService.getAll();

    this.subscription = this.route.queryParamMap
      .subscribe(params => {
        const category = params.get('category');
        this.selectedCategory = category ? [category] : null;
      });
  }

  isInCategory(category: string): boolean {
    if (!this.selectedCategory || this.selectedCategory[0] === 'all') return true;
    return category === this.selectedCategory[0];
  }

  onChange(): void {
    if (this.selectedCategory[0] === 'all')
      this.router.navigate(['/']);
    else
      this.router.navigate(['/'], { queryParams: { category: this.selectedCategory[0] } });
  }

}
