import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { ProductService } from '../../../shared/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Product, emptyProduct } from '../../../shared/models/product';
import { NgForm } from '@angular/forms';
import { isWebUri } from 'valid-url';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  categories$;
  // TODO: Store the value of these fields in local storage at some point to avoid losing on refresh
  product: Product = emptyProduct();
  productKey;
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService) {

    this.categories$ = this.categoryService.getAll();
    // TODO: Change 'id' input query parameter to 'key'
    this.productKey = this.route.snapshot.paramMap.get('id');
    if (this.productKey) {
      this.productService.get(this.productKey).pipe(take(1))
        .subscribe((product: Product | false) => {
          if (product)
            this.product = product;
          // If no product of the given query parameter id is found:
          else {
            this.router.navigate(['/admin/products/new']);
            // TODO: Display toast notification to say that the requested URL was invalid.
          }
        });
    }
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('edit'))
      this.editMode = true;
  }

  save(): void {
    const isFilled =
      this.product.category && this.product.imageUrl && this.product.price && this.product.title;
    // TODO: Refactor to avoid this kind of iteration altogether.  For one, this:
    //    this.product.category && this.product.imageUrl && this.product.price && this.product.title
    // might actually be better.  If the interface for a product changes, some other fields
    // might be allowed to be null.  In this form, we know we want all of these to be valid.
    // What would be better is if we could refactor and simply be able to check the formGroup.
    // So we should use reactive forms for this.

    // Object.values(this.product).forEach(x => {
    //   isFilled = isFilled && x !== null && x !== '';
    // });

    // TODO: Refactor to avoid this double validation of the url. (see above, use reactive forms)
    const isValid = isFilled && isWebUri(this.product.imageUrl);
    if (!isValid) {
      // TODO: Toast Notification
      return;
    }

    // FIXME: How do we detect errors in updating/creating? (then show with toast notification):
    //
    //        The answer is we should use the promise that the productService.update() method
    //        returns to us.
    if (this.editMode) this.productService.update(this.productKey, this.product);
    else this.productService.create(this.product);

    this.router.navigate(['/admin/products']);
  }

  delete(): void {
    // TODO: Bootstrap dialog box or Angular Material dialog box
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(this.productKey);
    this.router.navigate(['/admin/products']);
  }

  clear(f: NgForm): void {
    this.product = emptyProduct();
    f.resetForm();
  }

}
