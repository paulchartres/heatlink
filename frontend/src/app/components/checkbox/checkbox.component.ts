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

  /**
   * Whether this checkbox is readonly. The checkbox is filled and grayed out when set to true.
   */
  @Input() readonly: boolean = false;

  /**
   * Value double binding for external interaction.
   */
  @Input({ required: false }) value: boolean = false;
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter();

  /**
   * Called when the checkbox is pressed (label or box).
   */
  onToggle(): void {
    if (this.readonly) return;
    this.value = !this.value;

    this.valueChange.emit(this.value);
  }

}
