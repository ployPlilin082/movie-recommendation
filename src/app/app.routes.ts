import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './pages/navbar/navbar.component';

export const routes: Routes = [
    {path: '',component:HomeComponent},
    {path:'navbar',component:NavbarComponent}
];
