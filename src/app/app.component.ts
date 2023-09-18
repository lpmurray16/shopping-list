import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Item, RealtimeDatabaseService,  } from './services/realtime-database.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  items: Observable<Item[]>;
  sortedItems: Item[] = [];
  completedItems: Item[] = [];

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
    this.items.subscribe((items) => {
      this.sortedItems = items.sort((a, b) => a.sortOrder - b.sortOrder);
      this.sortedItems = this.sortedItems.filter((item) => !item.purchased);
      this.completedItems = items.filter((item) => item.purchased);
    });
  }

  addItem() {
    this.itemToAdd.sortOrder = this.sortedItems.length;

    this.itemToAdd.itemName = this.itemToAdd.itemName.charAt(0).toUpperCase() + this.itemToAdd.itemName.slice(1);
    this.itemToAdd.storeName = this.itemToAdd.storeName.charAt(0).toUpperCase() + this.itemToAdd.storeName.slice(1);
    
    this.realtimeDb.addItemToDb(this.itemToAdd);
    this.clearItemToAdd();
    this.firstInput.nativeElement.focus();
  }

  clearItemToAdd() {
    this.itemToAdd = {
      itemName: '',
      storeName: '',
      purchased: false,
      sortOrder: 0,
    };
  }

  markAsPurchased(itemKey: string) {
    this.realtimeDb.markPurchased(itemKey);
  }

  unmarkAsPurchased(itemKey: string) {
    this.realtimeDb.unmarkPurchased(itemKey);
  }

  clearCompletedItems() {
    this.completedItems.forEach((item) => {
      this.realtimeDb.removeItemByKey(item);
    });
  }

}
