import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HeaderComponent } from './header.component';
import { CurrencyService } from './../../services/currency.service';
import { RateResponse } from '../../models/RateResponse.model';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let service: CurrencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HeaderComponent],
      providers: [CurrencyService]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly initialize and display USD and EUR rates', () => {
    const mockResponse: RateResponse = {
      provider: "ExchangeRate-API",
      WARNING_UPGRADE_TO_V6: "Please upgrade to the latest version.",
      terms: "https://www.exchangerate-api.com/terms",
      base: "UAH",
      date: "2024-08-22",
      time_last_updated: 1627689600,
      rates: { UAH: 1, USD: 0.036, EUR: 0.031 }
    };

    fixture.detectChanges();

    const req = httpMock.expectOne('https://api.exchangerate-api.com/v4/latest/UAH');
    req.flush(mockResponse);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.USD).toBeCloseTo(1 / 0.036, 2);
      expect(component.EUR).toBeCloseTo(1 / 0.031, 2);
    });
  });
});
