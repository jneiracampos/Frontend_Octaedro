import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearcherSalariosComponent } from './searcher-salarios.component';

describe('SearcherSalariosComponent', () => {
  let component: SearcherSalariosComponent;
  let fixture: ComponentFixture<SearcherSalariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearcherSalariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearcherSalariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
