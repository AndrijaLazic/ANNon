import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MycellrenderComponent } from './mycellrender.component';

describe('MycellrenderComponent', () => {
  let component: MycellrenderComponent;
  let fixture: ComponentFixture<MycellrenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MycellrenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MycellrenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
