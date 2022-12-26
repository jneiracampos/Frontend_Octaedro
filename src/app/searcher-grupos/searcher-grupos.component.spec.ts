import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearcherGruposComponent } from './searcher-grupos.component';

describe('SearcherGruposComponent', () => {
  let component: SearcherGruposComponent;
  let fixture: ComponentFixture<SearcherGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearcherGruposComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearcherGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
