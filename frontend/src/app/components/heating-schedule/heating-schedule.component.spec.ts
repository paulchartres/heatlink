import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatingScheduleComponent } from './heating-schedule.component';

describe('HeatingScheduleComponent', () => {
  let component: HeatingScheduleComponent;
  let fixture: ComponentFixture<HeatingScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatingScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeatingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
