import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db: AngularFireDatabase) { }

  getAll(): Observable<any[]> {
    return this.db.list('/categories', ref => ref.orderByChild('name')).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => {
          return { key: c.payload.key, value: c.payload.val() };
        })));
  }

}
