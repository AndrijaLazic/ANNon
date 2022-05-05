import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoredjenjeModelaComponent } from './poredjenje-modela.component';

describe('PoredjenjeModelaComponent', () => {
  let component: PoredjenjeModelaComponent;
  let fixture: ComponentFixture<PoredjenjeModelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoredjenjeModelaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoredjenjeModelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
