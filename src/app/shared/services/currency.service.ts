import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RateResponse } from "../../shared/models/RateResponse.model";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) { }

  getExchangeRates(fromCurrency: string) {
    let url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    return this.http.get<RateResponse>(url);
  }

}
