import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { filter, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class HttpService {
  private nomicsKey = environment.nomicsKey;
  private nomicsUrl = environment.nomicsURL;
  get(url, params = {}, fullUrl = false) {
    const sendURL = fullUrl ? url : `${this.nomicsUrl}/${url}`;
    return this.http.get(sendURL, { params: { ...params, key: this.nomicsKey }}).pipe(
      filter(data => !!data),
      map((data: Array<object>) => data.map((el, i) => ({...el, key: i.toString()}))),
      catchError(err => of(err)),
    );
  }
  constructor(private http: HttpClient) { }
}
