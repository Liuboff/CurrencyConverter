import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CurrencyService } from '../../shared/services/currency.service';
import { Rates } from '../../shared/models/RateResponse.model';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss',
})
export class ConverterComponent implements OnInit {
  constructor(private currencyService: CurrencyService) {}

  currencies: string[] = ['UAH', 'EUR', 'USD', 'CAD'];
  rates: Rates = {};

  fromAmount: number = 0;
  fromCurrency: string = this.currencies[0];

  toAmount: number = 0;
  toCurrency: string = this.currencies[2];

  errorMessage: string | null = null;

  ngOnInit(): void {
    this.currencyService.getExchangeRates(this.fromCurrency).subscribe({
      next: (res) => {
        this.rates = res.rates;
        this.convertFrom();
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.rates = {};
      },
    });

    this.convertFrom();
  }

  onFromAmountChange() {
    this.convertFrom();
  }

  onFromCurrencyChange() {
    this.convertFrom();
  }

  onToAmountChange() {
    this.convertTo();
  }

  onToCurrencyChange() {
    this.convertFrom();
  }

  convertFrom() {
    if (this.fromCurrency && this.toCurrency) {
      this.toAmount = this.currencyService
      .convert(this.fromCurrency, this.toCurrency, this.fromAmount, this.rates);
    }
  }

  convertTo() {
    if (this.fromCurrency && this.toCurrency) {
      this.fromAmount = this.currencyService
        .convert(this.toCurrency, this.fromCurrency, this.toAmount, this.rates);
    }
  }
}
