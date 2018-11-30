import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/shared/http.service';
import { Observable, of } from 'rxjs';
import { ExchangeRate, ExchangeRateHistory } from '../models/conversion.models';
import { map, catchError, share } from 'rxjs/operators';
import * as moment from 'moment';
import { dateFormat } from 'src/app/shared/utils/formats';


@Injectable()
export class ConversionService {
  constructor(private http: HttpService) {}
  url = environment.nomicsURL;
  getExchangeRates(): Observable<ExchangeRate[]> {
    return this.http.get('exchange-rates').pipe(
      map(data => data as ExchangeRate[]),
      catchError(() => of([]))
    );
  }
  getExchangeRatesHistory(
    currency: string,
    period: number,
  ): Observable<ExchangeRateHistory[]> {
    const [start, end] = this.calculateDates(period);
    return this.http.get('exchange-rates/history', { currency, start, end }).pipe(
      share(),
    );
  }
  private calculateDates(period: number): string[] {
    const start = moment().subtract(period, 'days').format(dateFormat);
    const end = moment().format(dateFormat);
    return [start, end];
  }
}
