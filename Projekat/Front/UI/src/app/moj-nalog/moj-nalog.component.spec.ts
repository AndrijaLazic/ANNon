import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojNalogComponent } from './moj-nalog.component';

describe('MojNalogComponent', () => {
  let component: MojNalogComponent;
  let fixture: ComponentFixture<MojNalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MojNalogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MojNalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
