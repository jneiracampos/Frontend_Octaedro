import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearcherSectoresComponent } from './searcher-sectores.component';

describe('SearcherSectoresComponent', () => {
  let component: SearcherSectoresComponent;
  let fixture: ComponentFixture<SearcherSectoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearcherSectoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearcherSectoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
