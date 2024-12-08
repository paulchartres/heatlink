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

  @Input() loading: boolean = false;

  @Output() press: EventEmitter<void> = new EventEmitter();

  onClick(): void {
    if (this.loading) return;
    this.press.emit();
  }

}
