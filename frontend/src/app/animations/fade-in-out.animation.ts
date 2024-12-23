import { animate, style, transition, trigger } from '@angular/animations';

/**
 * A simple fade in/out animation used for @if conditions (context menus, widgets...)
 */
export const fadeAnimation = trigger('fade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('150ms ease-in', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('150ms ease-out', style({ opacity: 0 })),
  ]),
]);
