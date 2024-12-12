import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyDayScheduleModalComponent } from './copy-day-schedule-modal.component';

describe('CopyDayScheduleModalComponent', () => {
  let component: CopyDayScheduleModalComponent;
  let fixture: ComponentFixture<CopyDayScheduleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyDayScheduleModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyDayScheduleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
