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

  @Input() placeholder?: string;

  @Input() value?: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  @Output() confirm: EventEmitter<void> = new EventEmitter();

  onValueChange(value: string): void {
    this.value = value;
    this.valueChange.emit(this.value);
  }

  onConfirm(): void {
    this.confirm.emit();
  }

}
