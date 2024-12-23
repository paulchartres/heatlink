import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {

  /**
   * Whether our button is loading. Displays a spinner instead of the button label if true.
   */
  @Input() loading: boolean = false;

  /**
   * Whether the button is disabled. Grays out the button and prevents click events if true.
   */
  @Input() disabled: boolean = false;

  /**
   * Event emitted when the button is pressed. Won't fire if loading or disabled is true.
   */
  @Output() press: EventEmitter<void> = new EventEmitter();

  /**
   * Function called when the button is pressed.
   */
  onClick(): void {
    if (this.loading || this.disabled) return;
    this.press.emit();
  }

}
