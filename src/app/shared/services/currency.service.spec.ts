import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CurrencyService } from './currency.service';
import { RateResponse } from '../../shared/models/RateResponse.model';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService]
    });
    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve exchange rates successfully', () => {
    const mockResponse: RateResponse = {
      provider: "ExchangeRate-API",
      WARNING_UPGRADE_TO_V6: "Please upgrade to the latest version.",
      terms: "https://www.exchangerate-api.com/terms",
      base: "USD",
      date: "2023-08-19",
      time_last_updated: 1627689600,
      rates: { UAH: 27.5, EUR: 0.85, CAD: 1.3, USD: 1 }
    };

    service.getExchangeRates('USD').subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(response.rates['UAH']).toBe(27.5);
    });

    const req = httpMock.expectOne('https://api.exchangerate-api.com/v4/latest/USD');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle client-side error', () => {
    const mockError = new ErrorEvent('Network error', {
      message: 'Client-side error occurred'
    });

    service.getExchangeRates('USD').subscribe({
      next: () => fail('Expected error, but got success response'),
      error: (error: Error) => {
        expect(error.message).toBe('Client-side error: Client-side error occurred');
      }
    });

    const req = httpMock.expectOne('https://api.exchangerate-api.com/v4/latest/USD');
    req.error(mockError);
  });

  it('should convert currency correctly', () => {
    const rates = { UAH: 27.5, EUR: 0.85, CAD: 1.3, USD: 1 };
    const fromAmount = 100;
    const fromCurrency = 'UAH';
    const toCurrency = 'USD';

    const result = service.convert(fromCurrency, toCurrency, fromAmount, rates);
    expect(result).toBeCloseTo(3.64, 2);
  });
});
