import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss'
})
export class TextAreaComponent {

  @Input() placeholder?: string;

  @Input() value?: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  onValueChange(value: string): void {
    this.value = value;
    this.valueChange.emit(this.value);
  }

}
