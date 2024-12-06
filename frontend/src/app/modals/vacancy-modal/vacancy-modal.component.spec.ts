import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacancyModalComponent } from './vacancy-modal.component';

describe('VacancyModalComponent', () => {
  let component: VacancyModalComponent;
  let fixture: ComponentFixture<VacancyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacancyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacancyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
