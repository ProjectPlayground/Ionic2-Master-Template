import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
// import { StatusBar } from 'ionic-native';

import { Page1 } from '../page1/page1';
import { TabsPage } from '../tabs/tabs';
import { StartPage } from '../start/start';
import { FriendPage } from '../friend/friend';
import { ServerPage } from '../server/server';
import { CanvasPage } from '../canvas/canvas';

import * as firebase from 'firebase';


@Component({
  selector: 'page-side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenu {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = StartPage;

  backButton;
  myAuth;

  pages: Array<{title: string, component: any, active: boolean, class: string}>;

  constructor(public platform: Platform, public menuCtrl: MenuController) {
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: Page1, active: false, class: "black" },
      { title: 'Server', component: ServerPage, active: false, class: "black" },
      { title: 'Friends', component: FriendPage, active: false, class: "black" },
      { title: 'Canvas', component: CanvasPage, active: false, class: "black" },
      { title: 'Preferences', component: TabsPage, active: false, class: "black" },
      {title: 'Sign Off', component: true, active: true, class: "red" }
    ];
  }

  ionViewDidEnter() {
    let clickCount: number = 0;
    let timeClick: number = 0;

    this.platform.ready().then(() => {
      //Redefine Hardware Back Button
      this.backButton = this.platform.registerBackButtonAction( (e) => {
        //Define Menu
        if(this.menuCtrl.isOpen()){
          this.menuCtrl.close();
        }else if(clickCount == 0){
          this.nav.pop();
        }

        //Double Click Exit App at Home Screen
        let y:any = this.nav.parent._app._title;
        let z:any = "Page Uno";
        if(clickCount == 1 && y == z){
          navigator['app'].exitApp();
        }
        if(timeClick == 0){
          timeClick = 1;
          clickCount = 1;
          setTimeout(()=>{
            clickCount = 0;
            timeClick = 0;
          },500)
        }
      });
    });

    this.myAuth = firebase.auth().onAuthStateChanged((user) => {
      if(user == null){
        this.nav.setRoot(StartPage, {test: null});        
      }
    })
  }

  openPage(page) {
    if(page.component == Page1){
      this.nav.setRoot(page.component);
    }else{
      if(page.component === true){
        console.log('sign out');
        //Reset Back Button
        this.backButton();
        //Sign Off Firebase
        firebase.auth().signOut();
        // Return to Log In
      }else{
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component,{},{animate:false});
      }
    }
  }

}
