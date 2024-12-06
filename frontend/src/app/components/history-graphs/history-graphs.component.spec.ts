import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryGraphsComponent } from './history-graphs.component';

describe('HistoryGraphsComponent', () => {
  let component: HistoryGraphsComponent;
  let fixture: ComponentFixture<HistoryGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryGraphsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
