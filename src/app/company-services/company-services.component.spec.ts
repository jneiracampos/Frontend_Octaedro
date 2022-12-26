import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyServicesComponent } from './company-services.component';

describe('ServicesComponent', () => {
  let component: CompanyServicesComponent;
  let fixture: ComponentFixture<CompanyServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
