import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SacuvaniModeliComponent } from './sacuvani-modeli.component';

describe('SacuvaniModeliComponent', () => {
  let component: SacuvaniModeliComponent;
  let fixture: ComponentFixture<SacuvaniModeliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SacuvaniModeliComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SacuvaniModeliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
