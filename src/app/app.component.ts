import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  Item,
  RealtimeDatabaseService,
} from './services/realtime-database.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  items: Observable<Item[]>;

  itemsList: Item[] = [];
  copyOfItemsList: Item[] = [];
  filterByStoreSelection: string = 'all';

  unpurchasedList: Item[] = [];
  purchasedList: Item[] = [];

  warningIsLive: boolean = false;

  knownStores: string[] = [
    'Aldi',
    'Costco',
    'Sams Club',
    'Target',
    'Trader Joes',
    'Walmart',
    'Jewel',
    '',
  ];

  itemToAdd: Item = {
    itemName: '',
    storeName: '',
    purchased: false,
    sortOrder: 0,
  };

  @ViewChild('firstInput') firstInput!: ElementRef;

  constructor(private realtimeDb: RealtimeDatabaseService) {
    this.items = this.realtimeDb.getItems();
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.items.subscribe((items) => {
      this.itemsList = items;

      this.unpurchasedList = this.itemsList
        .filter((item) => !item.purchased)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      this.purchasedList = this.itemsList
        .filter((item) => item.purchased)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      this.copyOfItemsList = this.itemsList;
    });
  }

  addItem() {
    this.itemToAdd.sortOrder = this.unpurchasedList.length;
    this.itemToAdd.itemName =
      this.itemToAdd.itemName.charAt(0).toUpperCase() +
      this.itemToAdd.itemName.slice(1);
    this.itemToAdd.storeName =
      this.itemToAdd.storeName.charAt(0).toUpperCase() +
      this.itemToAdd.storeName.slice(1);

    this.checkStoreName(this.itemToAdd.storeName);

    this.realtimeDb.addItemToDb(this.itemToAdd);
    this.clearItemToAdd();
    this.firstInput.nativeElement.focus();
  }

  checkStoreName(storeName: string) {
    if (!this.knownStores.includes(storeName)) {
      this.showWarningFor3Seconds();
    }
  }

  clearItemToAdd() {
    this.itemToAdd = {
      itemName: '',
      storeName: '',
      purchased: false,
      sortOrder: 0,
    };
  }

  showWarningFor3Seconds() {
    this.warningIsLive = true;
    setTimeout(() => {
      this.warningIsLive = false;
    }, 3000);
  }

  markAsPurchased(itemKey: string) {
    this.realtimeDb.markPurchased(itemKey);
  }

  unmarkAsPurchased(itemKey: string) {
    this.realtimeDb.unmarkPurchased(itemKey, this.unpurchasedList.length);
  }

  clearCompletedItems() {
    this.purchasedList.forEach((item) => {
      this.realtimeDb.removeItemByKey(item);
    });
  }

  onFilterChange() {
    let filterSelection = this.filterByStoreSelection.toLowerCase();
    if (filterSelection === 'all') {
      this.unpurchasedList = this.copyOfItemsList
        .filter((x) => !x.purchased)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      return;
    }
    this.unpurchasedList = this.copyOfItemsList
      .filter((x) => !x.purchased)
      .sort((a, b) => {
        if (
          filterSelection &&
          a.storeName.toLowerCase().includes(filterSelection)
        ) {
          return -1;
        } else if (b.storeName.toLowerCase().includes(filterSelection)) {
          return 1;
        } else {
          return 0;
        }
      });
  }
}
