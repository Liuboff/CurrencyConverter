import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
registerLocaleData(localeUk, 'uk');

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
