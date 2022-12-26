import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearcherObjetivosComponent } from './searcher-objetivos.component';

describe('SearcherObjetivosComponent', () => {
  let component: SearcherObjetivosComponent;
  let fixture: ComponentFixture<SearcherObjetivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearcherObjetivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearcherObjetivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
