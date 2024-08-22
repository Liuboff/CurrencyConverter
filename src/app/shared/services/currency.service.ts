import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { RateResponse, Rates } from "../../shared/models/RateResponse.model";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) {}

  getExchangeRates(fromCurrency: string): Observable<RateResponse> {
    let url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    return this.http.get<RateResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  convert(fromCurrency: string, toCurrency: string, fromAmount: number, rates: Rates) {
    return +((fromAmount * rates[toCurrency]) / rates[fromCurrency]).toFixed(2);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

}
