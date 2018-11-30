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
import { filter, mergeMap, catchError } from 'rxjs/operators';
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
  exchangeRates$: Observable<ExchangeRate[]>;
  ratesHistory$: Observable<ExchangeRateHistory[]>;
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
    this.exchangeRates$ = this.cvService.getExchangeRates();
    this.storageData = this.storage.currentStorage;
    this.transactionToView = null;
  }
  tabChange(e: number) {
    this.tabIndex = e;
  }

  updatePeriod(e: number) {
    this.historyPeriod = e;
    this.getHistoryData();
  }

  prepareHistory(val: ExchangeEmit) {
    this.transactionInfo = val;
    this.saveToStorage(val);
    this.getHistoryData();
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
  private getHistoryData() {
    const { fromCurrency, toCurrency } = this.transactionInfo;
    const fromReq = this.cvService.getExchangeRatesHistory(
      fromCurrency,
      this.historyPeriod
    );
    const toReq = this.cvService.getExchangeRatesHistory(
      toCurrency,
      this.historyPeriod
    );
    this.ratesHistory$ = combineLatest(fromReq, toReq).pipe(
      filter(([d1, d2]) => !!d1 && !!d2),
      mergeMap(([d1, d2]) =>
        of(
          d1
            .reduce(
              (acc, { rate, timestamp }, ndx) => [
                ...acc,
                {
                  timestamp: moment(timestamp).format('DD/MM/YYYY'),
                  rate: this.calculateRate(rate, d2[ndx].rate)
                }
              ],
              []
            )
            .reverse()
        )
      ),
      catchError(() => of([]))
    );
  }
  private calculateRate(r1: string, r2: string): string {
    const temp1 = parseFloat(r1);
    const temp2 = parseFloat(r2);
    const result = Math.trunc((temp1 / temp2) * ratePrecision) / ratePrecision;
    return result.toString();
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
