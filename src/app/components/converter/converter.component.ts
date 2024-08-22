import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CurrencyService } from '../../shared/services/currency.service';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss',
})
export class ConverterComponent implements OnInit {
  constructor(private currencyService: CurrencyService) {}

  currencies: string[] = ['UAH', 'EUR', 'USD', 'CAD'];

  rates: { [key: string]: number } = {};

  fromAmount: number = 0;
  fromCurrency: string = this.currencies[0];

  toAmount: number = 0;
  toCurrency: string = this.currencies[2];

  ngOnInit(): void {
    this.currencyService.getExchangeRates(this.fromCurrency).subscribe((response) => {
        this.rates = response.rates;
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
    if (this.fromCurrency && this.toCurrency) {
      this.fromAmount = +((this.toAmount * this.rates[this.fromCurrency]) / this.rates[this.toCurrency]).toFixed(2);
    }
  }

  onToCurrencyChange() {
    this.convertFrom();
  }

  convertFrom() {
    if (this.fromCurrency && this.toCurrency) {
      this.toAmount = (this.fromAmount * this.rates[this.toCurrency]) / this.rates[this.fromCurrency];
    }
  }
}
