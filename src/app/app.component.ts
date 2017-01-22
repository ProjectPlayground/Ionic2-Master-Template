import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { SideMenu } from '../pages/side-menu/side-menu';

@Component({
  template: '<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = SideMenu;
}
