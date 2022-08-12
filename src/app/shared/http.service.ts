import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class HttpService {
  private exchangeUrl = environment.exchangeURL;
  get(url: string, params = {}, fullUrl = false) {
    const sendURL = fullUrl ? url : `${this.exchangeUrl}/${url}`;

    return this.http.get(sendURL, { params: { ...params}}).pipe(
      catchError(err => of(err)),
    );
  }
  constructor(private http: HttpClient) { }
}
