import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
registerLocaleData(localeUk, 'uk');

import { CurrencyService } from './../../services/currency.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private currencyService: CurrencyService) {}

  USD = 0;
  EUR = 0;

  ngOnInit() {
    this.currencyService.getExchangeRates('UAH').subscribe(res => {
      this.USD = this.currencyService.convert('USD', 'UAH', 1, res.rates);
      this.EUR = this.currencyService.convert('EUR', 'UAH', 1, res.rates);
    });
  }
}
