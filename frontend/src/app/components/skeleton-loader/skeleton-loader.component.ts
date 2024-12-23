import {Component, Input} from '@angular/core';
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule
  ],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss'
})
export class SkeletonLoaderComponent {

  /**
   * The height of the skeleton loader in pixels.
   */
  @Input({ required: true }) height!: number;

  /**
   * The width of the skeleton loader in pixels.
   */
  @Input({ required: true }) width!: number;

}
