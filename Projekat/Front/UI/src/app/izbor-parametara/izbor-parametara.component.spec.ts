import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzborParametaraComponent } from './izbor-parametara.component';





describe('IzborParametaraComponent', () => {
  let component: IzborParametaraComponent;
  let fixture: ComponentFixture<IzborParametaraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IzborParametaraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IzborParametaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
