import { Routes } from '@angular/router';
import {GuideComponent} from "./pages/guide/guide.component";
import {MainComponent} from "./pages/main/main.component";

export const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'guide',
    component: GuideComponent
  }
];
