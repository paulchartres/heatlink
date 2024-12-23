import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  /**
   * Event emitted when a click outside the component this directive is used on is detected.
   */
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  /**
   * Detects clicks anywhere on the page.
   * @param targetElement The element that was clicked.
   */
  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement): void {
    const isInside = this.elementRef.nativeElement.contains(targetElement);
    // This is necessary to ensure datepickers don't trigger the clickOutside event.
    const isInOverlay = this.isInDatepickerOverlay(targetElement);

    if (!isInside && !isInOverlay) {
      // We trigger the event emitter if the click is not within the component and not within a date picker.
      this.clickOutside.emit();
    }
  }

  /**
   * Extra function used to ensure we're not clicking a date picker overlay. This was a major bug in the vacancy modal.
   * @param targetElement The element that was clicked.
   * @private
   */
  private isInDatepickerOverlay(targetElement: HTMLElement): boolean {
    let currentElement = targetElement;

    while (currentElement) {
      if (currentElement.classList?.contains('mat-datepicker-content')) {
        // Checking for a class specific to Angular Material's datepicker overlay.
        return true;
      }
      // @ts-ignore
      currentElement = currentElement.parentElement;
    }

    return false;
  }
}
