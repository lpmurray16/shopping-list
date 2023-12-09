import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, map, take } from 'rxjs';

export interface Item {
  key?: string | null;
  itemName: string;
  storeName: string;
  purchased: boolean;
  sortOrder: number;
}

@Injectable({
  providedIn: 'root',
})
export class RealtimeDatabaseService {
  constructor(private realtimeDb: AngularFireDatabase) {}

  getItems(): Observable<Item[]> {
    return this.realtimeDb
      .list<Item>('items')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions
            .map((a) => {
              const data = a.payload.val() as Partial<Item>;
              const id = a.payload.key;
              return {
                key: id ?? null,
                itemName: data.itemName ?? '',
                storeName: data.storeName ?? '',
                purchased: data.purchased ?? '',
                sortOrder: data.sortOrder ?? '',
              } as Item;
            })
            .filter((item) => item.key !== null)
        )
      );
  }

  addItemToDb(item: Item) {
    return this.realtimeDb.list<Item>('items').push(item);
  }

  markPurchased(itemKey: string) {
    if (itemKey) {
      return this.realtimeDb
        .list<Item>('items')
        .update(itemKey, { purchased: true });
    }
    return null;
  }

  unmarkPurchased(itemKey: string, length: number) {
    if (itemKey) {
      return this.realtimeDb
        .list<Item>('items')
        .update(itemKey, { purchased: false, sortOrder: length });
    }
    return null;
  }

  removeItemByKey(item: Item): void {
    if (item.key) {
      const path = `items/${item.key}`;
      this.realtimeDb
        .object(path)
        .remove()
        .catch((error) => console.log(error));
    }
  }

  deleteAllPurchased(purchasedList: Item[]) {
    for (let item of purchasedList) {
      if (item.key) {
        this.removeItemByKey(item);
      }
    }
  }

  updateSortOrder(item: Item, newSortOrder: number) {
    if (item.key) {
      return this.realtimeDb
        .list<Item>('items')
        .update(item.key, { sortOrder: newSortOrder });
    }
    return null;
  }
}
