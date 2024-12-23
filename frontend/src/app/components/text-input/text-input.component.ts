import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent {

  /**
   * Optional placeholder to display in the text input.
   */
  @Input() placeholder?: string;

  /**
   * Double binding to allow bidirectional communication of the input value with the parent component.
   */
  @Input() value?: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  /**
   * Emitted when the user presses enter on the text field.
   */
  @Output() confirm: EventEmitter<void> = new EventEmitter();

  /**
   * Called when the value in the input field changes.
   * @param value The new value in the text field.
   */
  onValueChange(value: string): void {
    this.value = value;
    this.valueChange.emit(this.value);
  }

  /**
   * Called when the user presses enter on the text field.
   */
  onConfirm(): void {
    this.confirm.emit();
  }

}
