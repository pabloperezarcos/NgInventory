import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidarInventarioComponent } from './consolidar-inventario.component';

describe('ConsolidarInventarioComponent', () => {
  let component: ConsolidarInventarioComponent;
  let fixture: ComponentFixture<ConsolidarInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsolidarInventarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidarInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
