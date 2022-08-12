import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/shared/http.service';
import { Observable, of } from 'rxjs';
import { ExchangeRate } from '../models/conversion.models';
import { map, catchError} from 'rxjs/operators';

@Injectable()
export class ConversionService {
  constructor(private http: HttpService) { }
  url = environment.exchangeURL;

  getExchangeRates = (): Observable<ExchangeRate[]> => this.http.get('latest').pipe(
    map((data) => data.rates),
    map((data: Record<string, number>): Array<ExchangeRate> => {
      return Object.keys(data).map(key => ({ key, rate: data[key], currency: key }))
    }),
    catchError((er) => {
      console.warn(er);
      return of([])
    })
  );
}
