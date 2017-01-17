import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { SideMenu } from '../pages/side-menu/side-menu';

import * as firebase from 'firebase';

@Component({
  template: '<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SideMenu;

  constructor(public platform: Platform) {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCrjiyKQ60zJ2xrUM3JzUCfKFF2NTEtdkI",
      authDomain: "ajb3-myrpg.firebaseapp.com",
      databaseURL: "https://ajb3-myrpg.firebaseio.com",
      storageBucket: "ajb3-myrpg.appspot.com"
    };
    firebase.initializeApp(config);
  }
}
