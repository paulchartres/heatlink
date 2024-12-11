import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPresetModalComponent } from './new-preset-modal.component';

describe('NewPresetModalComponent', () => {
  let component: NewPresetModalComponent;
  let fixture: ComponentFixture<NewPresetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPresetModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPresetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
