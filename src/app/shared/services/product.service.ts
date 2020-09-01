import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

// TODO: Reference below may help to do what I was thinking of doing to reduce the number
// of Observables I create without necessitating something like redux:
// https://blog.strongbrew.io/how-share%28%29-can-reduce-network-requests/

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  getAll(): Observable<Product[]> {
    return this.db.list('/products').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => {
          return this.createProduct(c.payload.key, c.payload.val());
        })));
  }

  create(product): void {
    delete product.key;
    this.db.list('/products').push(product);
  }

  // This Observable returns false if a product with the given key does not exist.
  get(productKey): Observable<Product | false> {
    return this.db.object('/products/' + productKey).snapshotChanges().pipe(
      map(c => {
        if (!c.payload.exists())
          return false;
        return this.createProduct(c.payload.key, c.payload.val());
      }));
  }

  update(productKey, product): Promise<void> {
    delete product.key;
    return this.db.object('/products/' + productKey).update(product);
  }

  delete(productKey): Promise<void> {
    return this.db.object('/products/' + productKey).remove();
  }

  createProduct(givenKey: string, otherProductFields): Product {
    return { key: givenKey, ...otherProductFields};
  }

}
