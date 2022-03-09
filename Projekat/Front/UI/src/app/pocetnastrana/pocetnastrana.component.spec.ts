import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocetnastranaComponent } from './pocetnastrana.component';

describe('PocetnastranaComponent', () => {
  let component: PocetnastranaComponent;
  let fixture: ComponentFixture<PocetnastranaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PocetnastranaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PocetnastranaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
