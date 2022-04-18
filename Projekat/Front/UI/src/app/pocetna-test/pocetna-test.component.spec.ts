import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocetnaTestComponent } from './pocetna-test.component';

describe('PocetnaTestComponent', () => {
  let component: PocetnaTestComponent;
  let fixture: ComponentFixture<PocetnaTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PocetnaTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PocetnaTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
