import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RateResponse, Rates } from "../../shared/models/RateResponse.model";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) {}

  getExchangeRates(fromCurrency: string) {
    let url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    return this.http.get<RateResponse>(url);
  }

  convert(fromCurrency: string, toCurrency: string, fromAmount: number, toAmount: number, rates: Rates) {
    return toAmount = +((fromAmount * rates[toCurrency]) / rates[fromCurrency]).toFixed(2);
  }

}
