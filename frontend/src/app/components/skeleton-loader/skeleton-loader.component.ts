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

  @Input({ required: true }) height!: number;
  @Input({ required: true }) width!: number;

}
