import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StorageItem, ExchangeTrans } from '../../models/conversion.models';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styles: []
})
export class HistoryComponent {
  @Input()
  stats: StorageItem[] = [];

  @Output()
  viewTransaction = new EventEmitter<ExchangeTrans>();

  @Output()
  deleteTransaction = new EventEmitter<number>();


  columnDef = ['date', 'event', 'view', 'delete'];
  constructor() {
  }

  viewItem(el: ExchangeTrans) {
    this.viewTransaction.emit(el);
  }
  deleteItem({unixDate}: StorageItem) {
    this.deleteTransaction.emit(unixDate);
  }
}
