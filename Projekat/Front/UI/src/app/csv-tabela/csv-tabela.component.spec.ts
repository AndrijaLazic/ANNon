import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CsvTabelaComponent } from './csv-tabela.component';
import { ColDef } from 'ag-grid-community';

describe('CsvTabelaComponent', () => {
  let component: CsvTabelaComponent;
  let fixture: ComponentFixture<CsvTabelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsvTabelaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvTabelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
