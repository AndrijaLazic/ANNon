import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupProzorComponent } from './popup-prozor.component';

describe('PopupProzorComponent', () => {
  let component: PopupProzorComponent;
  let fixture: ComponentFixture<PopupProzorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupProzorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupProzorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
