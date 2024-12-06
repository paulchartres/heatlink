import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceHeatzyProComponent } from './device-heatzy-pro.component';

describe('DeviceHeatzyProComponent', () => {
  let component: DeviceHeatzyProComponent;
  let fixture: ComponentFixture<DeviceHeatzyProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceHeatzyProComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceHeatzyProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
