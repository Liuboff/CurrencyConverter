import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CurrencyService } from '../../shared/services/currency.service';
import { ConverterComponent } from './converter.component';
import { Rates } from '../../shared/models/RateResponse.model';

class MockCurrencyService {
  getExchangeRates(fromCurrency: string) {
    const mockRates: Rates = { USD: 1, EUR: 0.85, UAH: 27.5, CAD: 1.3 };
    return of({
      provider: "mockProvider",
      WARNING_UPGRADE_TO_V6: "This is a mock warning",
      terms: "https://mockterms.com",
      base: fromCurrency,
      date: "2024-08-22",
      time_last_updated: 1627689600,
      rates: mockRates
    });
  }

  convert(fromCurrency: string, toCurrency: string, fromAmount: number, rates: Rates): number {
    return +(fromAmount * rates[toCurrency] / rates[fromCurrency]).toFixed(2);
  }
}

describe('ConverterComponent', () => {
  let component: ConverterComponent;
  let fixture: ComponentFixture<ConverterComponent>;
  let currencyService: CurrencyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConverterComponent, HttpClientTestingModule],
      providers: [{ provide: CurrencyService, useClass: MockCurrencyService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ConverterComponent);
    component = fixture.componentInstance;
    currencyService = TestBed.inject(CurrencyService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default currency values and rates', () => {
    expect(component.fromCurrency).toBe('UAH');
    expect(component.toCurrency).toBe('USD');
    expect(component.rates['USD']).toBe(1);
  });

  it('should convert from UAH to USD correctly', () => {
    component.fromAmount = 100;
    component.convertFrom();
    expect(component.toAmount).toBeCloseTo(3.64, 2);
  });

  it('should convert from USD to EUR correctly', () => {
    component.fromCurrency = 'USD';
    component.toCurrency = 'EUR';
    component.fromAmount = 100;
    component.convertFrom();
    expect(component.toAmount).toBeCloseTo(85, 2);
  });

  it('should handle API error correctly', () => {
    spyOn(currencyService, 'getExchangeRates').and.returnValue(throwError(() => new Error('API error')));
    component.ngOnInit();
    expect(component.errorMessage).toBe('API error');
    expect(component.rates).toEqual({});
  });

  it('should clear errorMessage after successful API call', () => {
    spyOn(currencyService, 'getExchangeRates').and.returnValue(of({
      provider: "mockProvider",
      WARNING_UPGRADE_TO_V6: "This is a mock warning",
      terms: "https://mockterms.com",
      base: component.fromCurrency,
      date: "2024-08-22",
      time_last_updated: 1627689600,
      rates: { USD: 1, EUR: 0.85 }
    }));
    component.ngOnInit();
    expect(component.errorMessage).toBeNull();
  });
});
