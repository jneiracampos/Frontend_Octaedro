import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearcherProgramasComponent } from './searcherProgramas.component';

describe('SearcherProgramasComponent', () => {
  let component: SearcherProgramasComponent;
  let fixture: ComponentFixture<SearcherProgramasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearcherProgramasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearcherProgramasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
