import { PrefixNot } from '@angular/compiler';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './pages/board/board.component';
import { BoardsOverviewComponent } from './pages/boards-overview/boards-overview.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MainPageComponent } from './pages/main-page/main-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'signin',
    component: LoginPageComponent,

  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'allboards',
    component: BoardsOverviewComponent,
  },
  {
    path: 'board',
    component: BoardComponent,
    pathMatch: 'prefix',
  },
  {
    path: '',
    pathMatch: 'full',
    component: MainPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
