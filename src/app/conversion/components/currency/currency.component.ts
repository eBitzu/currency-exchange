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
    return this.conversionForm.get('amount')?.value || 0;
  }
  get fromCurrency(): string {
    return this.conversionForm.get('fromCurrency')?.value || '';
  }
  get toCurrency(): string {
    return this.conversionForm.get('toCurrency')?.value || '';
  }
  get result(): string {
    if (this.formEnabled && this.amount) {
      return this.unknownSymbol;
    }
    return (this.conversionForm.get('result')?.value || 0).toString();
  }
  get oneFrom(): string {
    if (this.formEnabled) {
      return this.unknownSymbol;
    }
    return (this.conversionForm.get('oneFrom')?.value || 0).toString();
  }
  get oneTo(): string {
    if (this.formEnabled) {
      return this.unknownSymbol;
    }
    return (this.conversionForm.get('oneTo')?.value || 0).toString();
  }
  @ViewChild('conversionBtn')
  convertbtn: ElementRef<HTMLBaseElement> = null;

  @Input()
  exchangeRates: ExchangeRate[];

  @Input()
  transaction: ExchangeTrans;

  @Output()
  converted = new EventEmitter<ExchangeEmit>();

  unknownSymbol = '???';
  conversionForm = new FormGroup({
    amount: new FormControl(10, Validators.required),
    fromCurrency: new FormControl('USD'),
    toCurrency: new FormControl('EUR'),
    result: new FormControl(0),
    oneFrom: new FormControl(0),
    oneTo: new FormControl(0)
  });
  private btnSubscription: Subscription;
  switch() {
    const from = this.fromCurrency;
    const to = this.toCurrency;
    this.conversionForm.patchValue({
      fromCurrency: to,
      toCurrency: from
    });
    this.updateResult();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes && changes["transaction"]) {
      const tr: SimpleChange = changes["transaction"];
      if (!!tr.currentValue) {
        this.conversionForm.patchValue(tr.currentValue);
        this.conversionForm.disable();
        this.conversionForm.updateValueAndValidity();
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
  updateResult() {
    if (!this.formEnabled || !environment.allowChanges) {
      return;
    }
    this.convert();
  }
  get formEnabled() {
    return this.conversionForm.enabled;
  }
  makeConversion() {
    if (this.formEnabled) {
      this.conversionForm.disable();
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
      this.conversionForm.enable();
    }
  }

  convert() {
    const fromEuroRate = this.getRate(this.fromCurrency);
    const toEuroRate = this.getRate(this.toCurrency);
    const [result, oneFrom, oneTo] = getConversions(
      this.amount,
      fromEuroRate,
      toEuroRate
    );
    this.conversionForm.patchValue({
      result,
      oneFrom,
      oneTo
    });
    this.conversionForm.updateValueAndValidity();
  }
  getRate(val: string): number {
    const foundRate = this.exchangeRates.find(el => el.key === val);

    return foundRate ? foundRate.rate : 1
  }
}
