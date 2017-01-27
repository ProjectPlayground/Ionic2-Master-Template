import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StartPage } from '../start/start';
import { AngularFire } from 'angularfire2';
import * as firebase from 'firebase';

@Component({
  selector: 'page-redirect',
  templateUrl: 'redirect.html'
})
export class RedirectPage {

  myAuth;

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {}

  ionViewWillEnter() {
    console.log('ionViewDidLoad RedirectPage');
    this.myAuth = firebase.auth().onAuthStateChanged((user) => {
      if(user == null){
        this.myAuth();
        this.navCtrl.setRoot(StartPage, {test: null, b: true});
      }
    })
    this.af.auth.logout();
  }
}
