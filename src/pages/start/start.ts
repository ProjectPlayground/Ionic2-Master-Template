import {Component, ViewChild} from '@angular/core';
import {Nav, NavController, ToastController, NavParams, MenuController} from 'ionic-angular';
import * as firebase from 'firebase';

import { Page1 } from '../page1/page1';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  templateUrl: 'start.html'
})
export class StartPage {

  @ViewChild(Nav) nav: Nav;

  newUser:boolean = false;
  p;
  myAuth;

  user = {name:"", password:""};
  errorMes;
  submitStat:boolean = false;
  logInStat:boolean = false;
  hideTab:boolean = true;
  connectStat;

  ionViewDidEnter(){
    //disable side menu
    this.menu.enable(false);
    //Make sure SignIn.Auth fires once
    this.p = this.navParams.get('test');

    this.init();
  }

  ionViewWillUnload(){
    this.connectStat.off();
    //turn off Auth Listener
    this.myAuth();
    //turn on side-menu
    this.menu.enable(true);
  }

  constructor(
    public navCtrl: NavController,
    private toastController : ToastController,
    private navParams: NavParams,
    public menu: MenuController,
    public af: AngularFire
    ) {}

  submit(){
    ////Submit Sign-Up request
    this.errorMes = "";
    this.logInStat = true;
    this.newUser = true;
    var email = this.user.name + "@aj.com";
    var password = "abc123";
    //create user
    firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
      // Handle Errors here.
      var errorMessage = error;
      this.errorMes = errorMessage;
      if(error){
        this.submitStat = false;
        this.logInStat = false;
      }
    })
  }

  login(){
    ////Log-In User Button
    this.errorMes = "";
    this.submitStat = true;
    this.logInStat = true;
    var email = this.user.name + "@aj.com";
    var password = "abc123";
    //log-in user
    firebase.auth().signInWithEmailAndPassword(email, password).catch((error:any) => {
      // Handle Errors here.
      if(error){
        this.submitStat = false;
        this.logInStat = false;
      }
    });
  }

  init(){
    ////Initialize
    //Make sure Auth fires once
    if(this.p || this.p == null){
    // Check if logged in
    this.myAuth = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //Check if new user
        firebase.database().ref('users/' + user.uid).once('value', snap =>{
          if(snap.val() === null ){
            //Make new user database
            //Set user database
            firebase.database().ref('users/' + user.uid).set({
              id: user.uid,
              name: this.user.name
            });
            firebase.database().ref('friends/' + user.uid + '/metaData').set({
              id: user.uid,
              name: this.user.name
            });
          }
        })
        //Go to home page
        this.navCtrl.setRoot(Page1, {name: this.user.name});
      }
    })
      //check connectcion w/ toast
      var n = 0;
      this.connectStat = firebase.database().ref('.info/connected');
      this.connectStat.on('value', snap => {
         if (snap.val() === true) {
           console.log('connected');
           this.submitStat = false;
           this.p = true;
         }else{
           console.log('not connected');
           this.p = false;
           let toast = this.toastController.create({
             message: 'Sorry you are not connected',
             duration: 3000
           });
           if(n > 0){
            toast.present();
          }
          n = n + 1;
         }
       });
     }
   }
}
