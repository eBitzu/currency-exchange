import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import {
  historyIntervals,
  ExchangeRateHistory,
  ratePrecision
} from '../../models/conversion.models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-rates-history',
  templateUrl: './rates-history.component.html'
})
export class RatesHistoryComponent implements OnChanges {
  get values () {
    return JSON.stringify(this.ratesHistory);
  }
  constructor() {
    this.ratesHistory = [];
  }
  @Input()
  ratesHistory: ExchangeRateHistory[];
  @Output()
  periodChanged = new EventEmitter<number>();
  stats = [
    { value: 0, label: 'Lowest' },
    { value: 0, label: 'Highest' },
    { value: 0, label: 'Average' }
  ];
  historyPeriods = historyIntervals;
  exchangePeriod = new FormControl(historyIntervals[0].days);
  ngOnChanges(changes: SimpleChanges ) {
    if (!!changes && !!this.ratesHistory) {
      this.populateStats();
    }
  }
  updateDuration(e: {value: number}) {
    this.periodChanged.emit(e.value);
  }
  private populateStats() {
    const [min, max, avg] = this.stats;
    let sum = 0;
    min.value = parseFloat(this.ratesHistory[0].rate);
    this.ratesHistory.forEach(({rate}) => {
      const temp = parseFloat(rate);
      if ( temp < min.value) {
        min.value = temp;
      }
      if (temp > max.value ) {
        max.value = temp;
      }
      sum += temp;
    });
    avg.value = Math.trunc(sum * ratePrecision / this.ratesHistory.length) / ratePrecision ;
  }
}
