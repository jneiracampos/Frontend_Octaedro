import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearcherHabilidadesComponent } from './searcher-habilidades.component';

describe('SearcherHabilidadesComponent', () => {
  let component: SearcherHabilidadesComponent;
  let fixture: ComponentFixture<SearcherHabilidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearcherHabilidadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearcherHabilidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
