import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material-module';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SigninFormComponent } from './components/signin-form/signin-form.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { LogoutComponent } from './components/logout/logout.component';
import { BoardsOverviewComponent } from './pages/boards-overview/boards-overview.component';
import { BoardComponent } from './pages/board/board.component';

import { JwtModule } from '@auth0/angular-jwt';
import { BoardCardComponent } from './components/boards/board-card/board-card.component';
import { LoadingSpinnerComponent } from './components/misc/loading-spinner/loading-spinner.component';
import { CreateBoardDialogComponent } from './components/boards/create-board-dialog/create-board-dialog.component';

import { environment } from 'src/environments/environment';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChangeValueComponent } from './components/dialogs/change-value/change-value.component';
import { CardComponent } from './components/dialogs/card/card.component';

function tokenGetter() {
  return localStorage.getItem('user');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    LoginFormComponent,
    SigninFormComponent,
    MainPageComponent,
    LogoutComponent,
    BoardsOverviewComponent,
    BoardComponent,
    BoardCardComponent,
    LoadingSpinnerComponent,
    CreateBoardDialogComponent,
    ProfileComponent,
    ChangeValueComponent,
    CardComponent,
  ],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:5000', environment.apiUrl, environment.apiUrl.replace('https://', '')],
        disallowedRoutes: [],
      }
    }),
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    let allowedDomains = ['localhost:5000', environment.apiUrl, environment.apiUrl.replace('https://', '')];
    console.warn('allowedDomains : ', allowedDomains)
  }
}

/*
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  */