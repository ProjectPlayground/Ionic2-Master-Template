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
import { BadWords } from '../assets/providers/bad-words/bad-words';

import { QRCodeModule } from 'angular2-qrcode';

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
    CanvasPage

  ],
  imports: [
    IonicModule.forRoot(MyApp),
    QRCodeModule
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
    CanvasPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
