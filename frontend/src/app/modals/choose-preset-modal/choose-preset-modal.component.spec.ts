import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePresetModalComponent } from './choose-preset-modal.component';

describe('ChoosePresetModalComponent', () => {
  let component: ChoosePresetModalComponent;
  let fixture: ComponentFixture<ChoosePresetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoosePresetModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoosePresetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
