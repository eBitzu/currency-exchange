import { Component, OnInit } from '@angular/core';
import { ConversionService } from './services/conversion.service';
import { Observable, combineLatest, of } from 'rxjs';
import {
  ExchangeRate,
  ExchangeEmit,
  ExchangeRateHistory,
  ratePrecision,
  ExchangeTrans,
  StorageItem
} from './models/conversion.models';
import { filter, mergeMap, catchError, take } from 'rxjs/operators';
import * as moment from 'moment';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-conversion',
  templateUrl: './conversion.component.html',
  styles: []
})
export class ConversionComponent implements OnInit {
  constructor(
    private cvService: ConversionService,
    private storage: StorageService
  ) {}
  get tabIndex(): number {
    return this._tabIndex;
  }
  set tabIndex(v: number) {
    this._tabIndex = v;
  }
  transactionToView: ExchangeTrans;
  storageData: StorageItem[] = [];
  exchangeRates:ExchangeRate[];
  historyEnabled = false;
  historyPeriod = 7;
  transactionInfo: ExchangeTrans = {
    fromCurrency: '',
    toCurrency: '',
    amount: 0,
    result: '0',
    oneFrom: '0',
    oneTo: '0'
  };

  private _tabIndex = 0;

  ngOnInit() {
    this.cvService.getExchangeRates().pipe(
      take(1)
    ).subscribe(data => {
      this.exchangeRates = data;
    })
    this.storageData = this.storage.currentStorage;
    this.transactionToView = null;
  }
  tabChange(e: number) {
    this.tabIndex = e;
  }

  updatePeriod(e: number) {
    this.historyPeriod = e;
  }

  prepareHistory(val: ExchangeEmit) {
    this.transactionInfo = val;
    this.saveToStorage(val);
    this.historyEnabled = !val.formEnabled;
  }
  displayTransaction(e: ExchangeTrans) {
    this.transactionToView = e;
    this.tabIndex = 0;
  }
  deleteTransaction(e: number) {
    this.storage.deleteItem(e);
    this.storageData = this.storage.currentStorage;
  }

  private saveToStorage(val: ExchangeTrans) {
    const { amount, fromCurrency, toCurrency } = val;
    const now = moment();
    const date = now.format('DD/MM/YYYY [@] HH:mm');
    const unixDate = parseInt(now.format('X'), 10);
    const event = `Converted an amount of ${amount} from ${fromCurrency} to ${toCurrency}`;
    const toStore: StorageItem = Object.assign({}, val, {
      date,
      unixDate,
      event
    });
    this.storage.setToStorage(toStore);
    this.storageData = this.storage.currentStorage;
  }
}
