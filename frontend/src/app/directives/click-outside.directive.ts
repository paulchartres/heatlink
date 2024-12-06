import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement): void {
    const isInside = this.elementRef.nativeElement.contains(targetElement);
    const isInOverlay = this.isInDatepickerOverlay(targetElement);

    if (!isInside && !isInOverlay) {
      this.clickOutside.emit();
    }
  }

  private isInDatepickerOverlay(targetElement: HTMLElement): boolean {
    let currentElement = targetElement;

    while (currentElement) {
      if (currentElement.classList?.contains('mat-datepicker-content')) {
        // Check for a class specific to Angular Material's datepicker overlay
        return true;
      }
      // @ts-ignore
      currentElement = currentElement.parentElement;
    }

    return false;
  }
}
