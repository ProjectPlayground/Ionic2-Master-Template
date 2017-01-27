import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { StartPage } from '../pages/start/start';
import {HomePage} from '../pages/home/home';
import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import { TabsPage } from '../pages/tabs/tabs';
import { FriendPage } from '../pages/friend/friend';
import { SideMenu } from '../pages/side-menu/side-menu';
import { ServerPage } from '../pages/server/server';
import { CanvasPage } from '../pages/canvas/canvas';
import { RedirectPage } from '../pages/redirect/redirect';
import { QR } from '../pages/qr/qr';
import { BadWords } from '../assets/providers/bad-words/bad-words';

import { QRCodeModule } from 'angular2-qrcode';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCrjiyKQ60zJ2xrUM3JzUCfKFF2NTEtdkI",
  authDomain: "ajb3-myrpg.firebaseapp.com",
  databaseURL: "https://ajb3-myrpg.firebaseio.com",
  storageBucket: "ajb3-myrpg.appspot.com"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    StartPage,
    HomePage,
    AboutPage,
    ContactPage,
    TabsPage,
    FriendPage,
    SideMenu,
    ServerPage,
    CanvasPage,
    RedirectPage,
    QR

  ],
  imports: [
    IonicModule.forRoot(MyApp),
    QRCodeModule,
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    StartPage,
    HomePage,
    AboutPage,
    ContactPage,
    TabsPage,
    FriendPage,
    SideMenu,
    ServerPage,
    CanvasPage,
    RedirectPage,
    QR
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {
  constructor(){
    firebase.initializeApp(firebaseConfig);
  }
}