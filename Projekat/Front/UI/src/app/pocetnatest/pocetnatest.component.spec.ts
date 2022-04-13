import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocetnatestComponent } from './pocetnatest.component';

describe('PocetnatestComponent', () => {
  let component: PocetnatestComponent;
  let fixture: ComponentFixture<PocetnatestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PocetnatestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PocetnatestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
