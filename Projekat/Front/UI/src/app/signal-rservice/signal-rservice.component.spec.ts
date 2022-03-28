import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalRServiceComponent } from './signal-rservice.component';

describe('SignalRServiceComponent', () => {
  let component: SignalRServiceComponent;
  let fixture: ComponentFixture<SignalRServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignalRServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalRServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
