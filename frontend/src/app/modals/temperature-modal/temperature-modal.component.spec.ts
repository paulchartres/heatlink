import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureModalComponent } from './temperature-modal.component';

describe('TemperatureModalComponent', () => {
  let component: TemperatureModalComponent;
  let fixture: ComponentFixture<TemperatureModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemperatureModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemperatureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
