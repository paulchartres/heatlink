import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent {

  @Input() readonly: boolean = false;

  @Input({ required: false }) value: boolean = false;
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter();

  onToggle(): void {
    if (this.readonly) return;
    this.value = !this.value;
    this.valueChange.emit(this.value);
  }

}
