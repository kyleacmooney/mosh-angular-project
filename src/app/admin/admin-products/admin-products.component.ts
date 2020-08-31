import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ProductService } from './../../services/product.service';
import { Product } from 'src/app/models/product';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  products: Product[];
  filteredProducts: Product[];
  displayedColumns: string[] = ['title', 'price', 'edit'];
  subscription: Subscription;
  dataSource: MatTableDataSource<Product>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private productService: ProductService) {
    this.subscription = this.productService.getAll()
      .subscribe((products: Product[]) => {
        this.filteredProducts = this.products = products;
        this.initializeTable(this.filteredProducts);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  private initializeTable(products: Product[]): void {
    this.dataSource = new MatTableDataSource(this.filteredProducts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filter(query: string): void {
    this.filteredProducts = (query) ?
      this.products.filter((p: Product) =>
        p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;
    this.initializeTable(this.filteredProducts);
  }

  sortData(sort: Sort): void {
    const data = this.filteredProducts.slice();
    if (!sort.active || sort.direction === '') {
      this.filteredProducts = data; // TODO: Why is this needed?
      return;
    }

    this.filteredProducts = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title': return compare(a.title, b.title, isAsc);
        case 'price': return compare(a.price, b.price, isAsc);
        default: return 0;
      }
    });

    this.initializeTable(this.filteredProducts);
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
