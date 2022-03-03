import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PretragaIDComponent } from './pretraga-id.component';

describe('PretragaIDComponent', () => {
  let component: PretragaIDComponent;
  let fixture: ComponentFixture<PretragaIDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PretragaIDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PretragaIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
