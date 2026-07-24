import { Routes } from '@angular/router';
import { HomeComponent } from './components/home-component/home-component';
import { ExperienceComponent } from './components/experience-component/experience-component';
import { SkillsComponent } from './components/skills-component/skills-component';
import { SetupComponent } from './components/setup-component/setup-component';
import { ContactComponent } from './components/contact-component/contact-component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'setup', component: SetupComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '/home' },
];
