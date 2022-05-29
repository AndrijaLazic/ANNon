import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MycellRenderComponent } from './mycell-render.component';

describe('MycellRenderComponent', () => {
  let component: MycellRenderComponent;
  let fixture: ComponentFixture<MycellRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MycellRenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MycellRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
