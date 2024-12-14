import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyScheduleToDevicesModalComponent } from './copy-schedule-to-devices-modal.component';

describe('CopyScheduleToDevicesModalComponent', () => {
  let component: CopyScheduleToDevicesModalComponent;
  let fixture: ComponentFixture<CopyScheduleToDevicesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyScheduleToDevicesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyScheduleToDevicesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
