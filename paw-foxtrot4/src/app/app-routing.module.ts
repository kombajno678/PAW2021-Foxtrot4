import { PrefixNot } from '@angular/compiler';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './components/boards/board/board.component';
import { BoardsOverviewComponent } from './components/boards/boards-overview/boards-overview.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
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
