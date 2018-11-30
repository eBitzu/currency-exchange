import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { getConversions } from 'src/app/shared/utils/functions';
import { environment } from 'src/environments/environment';
import { ExchangeEmit, ExchangeRate, ExchangeTrans } from '../../models/conversion.models';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styles: []
})
export class CurrencyComponent implements AfterViewInit, OnDestroy, OnChanges {
  constructor() {
    this.exchangeRates = [];
  }
  get amount(): number {
    return this.conversion.get('amount').value;
  }
  get fromCurrency(): string {
    return this.conversion.get('fromCurrency').value;
  }
  get toCurrency(): string {
    return this.conversion.get('toCurrency').value;
  }
  get result(): string {
    if (this.formEnabled && this.amount) {
      return this.unknownSymbol;
    }
    return this.conversion.get('result').value;
  }
  get oneFrom(): string {
    if (this.formEnabled) {
      return this.unknownSymbol;
    }
    return this.conversion.get('oneFrom').value;
  }
  get oneTo(): string {
    if (this.formEnabled) {
      return this.unknownSymbol;
    }
    return this.conversion.get('oneTo').value;
  }
  @ViewChild('conversionBtn')
  convertbtn: ElementRef<HTMLBaseElement>;

  @Input()
  exchangeRates: ExchangeRate[];

  @Input()
  transaction: ExchangeTrans;

  @Output()
  converted = new EventEmitter<ExchangeEmit>();

  unknownSymbol = '???';
  conversion = new FormGroup({
    amount: new FormControl(0, Validators.required),
    fromCurrency: new FormControl('EUR'),
    toCurrency: new FormControl('USD'),
    result: new FormControl(0),
    oneFrom: new FormControl(0),
    oneTo: new FormControl(0)
  });
  private btnSubscription: Subscription;
  private getConversions = getConversions;
  switch() {
    const from = this.fromCurrency;
    const to = this.toCurrency;
    this.conversion.patchValue({
      fromCurrency: to,
      toCurrency: from
    });
    this.updateResult();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes && changes.transaction) {
      const tr: SimpleChange = changes.transaction;
      if (!!tr.currentValue) {
        this.conversion.patchValue(tr.currentValue);
        this.conversion.disable();
        this.conversion.updateValueAndValidity();
      }
    }
  }
  ngOnDestroy() {
    this.btnSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    if (!!this.convertbtn) {
      this.btnSubscription = fromEvent(this.convertbtn.nativeElement, 'click')
      .pipe(
          debounceTime(500),
        )
        .subscribe(() => this.makeConversion());
    }
  }
  updateResult(e?: number) {
    if (!this.formEnabled || !environment.allowChanges) {
      return;
    }
    this.convert();
  }
  get formEnabled() {
    return this.conversion.enabled;
  }
  makeConversion() {
    if (this.formEnabled) {
      this.conversion.disable();
      this.convert();
      this.converted.emit({
        fromCurrency: this.fromCurrency,
        toCurrency: this.toCurrency,
        amount: this.amount,
        result: this.result,
        oneFrom: this.oneFrom,
        oneTo: this.oneTo,
        formEnabled: this.formEnabled
      });
    } else {
      this.conversion.enable();
    }
  }

  convert() {
    const fromDolarRate = this.getRate(this.fromCurrency);
    const toDolarRate = this.getRate(this.toCurrency);
    const [result, oneFrom, oneTo] = this.getConversions(
      this.amount,
      fromDolarRate,
      toDolarRate
    );
    this.conversion.patchValue({
      result,
      oneFrom,
      oneTo
    });
    this.conversion.updateValueAndValidity();
  }
  getRate(val: string): number {
    const foundRate = this.exchangeRates.find(el => el.currency === val);
    if (!foundRate || !foundRate.rate) {
      return 1;
    }
    if (!parseFloat(foundRate.rate)) {
      return 1;
    }
    return parseFloat(foundRate.rate);
  }
}
