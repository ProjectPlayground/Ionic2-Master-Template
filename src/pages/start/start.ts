import {Component, ViewChild} from '@angular/core';
import {Nav, NavController, ToastController, NavParams, MenuController} from 'ionic-angular';
import * as firebase from 'firebase';

import { Page1 } from '../page1/page1';

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
    public menu: MenuController
    ) {
      }

  //  Random Number Generator
  numbGen() {
    return ((Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-9)
  }


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
      console.log(error);
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
      console.log(error.code);
      if(error){
        this.submitStat = false;
        this.logInStat = false;
      }
    });
  }

  loginServer(){
    var token = "de5ae0dbddabd649fb2c735b15acd20b59335912";
    // var custom:any = firebase.auth();
    // var customToken:any = custom.createCustomToken(token);
    firebase.auth().signInWithCustomToken(token).catch((error:any) => {
      // Handle Errors here.
    });
  }

  snapLog:boolean = false;
  init(){
    ////Initialize
    //Make sure Auth fires once
    if(this.p || this.p == null){
    // Check if logged in
    this.myAuth = firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        // User is signed in.
        //Check if new user
        firebase.database().ref('users/' + user.uid).once('value',snap1 =>{
          if(snap1.val() === null ){
            //Make new user database
            this.snapLog = false;
            //Get user total number
            firebase.database().ref('userData/count').transaction((snap) => {
                   //Make sure transaction fires 1
                 if(this.snapLog == false){
                   console.log('snap return');
                   return snap+1;
                 }else{
                   console.log('snap exit');
                   return;
                 }

            }, (error, committed, snapshot) => {
                  if (error) {
                    console.log('Transaction failed abnormally!', error);
                  } else if (!committed) {
                    console.log('We aborted the transaction (already exists).');
                  } else {
                    console.log('User added!');
                    this.snapLog = true;
                    //Set user database
                   console.log('database added');
                   let idCode2:string = snapshot.val() + this.numbGen();
                   firebase.database().ref('users/' + user.uid).set({
                     id: user.uid,
                     idCode: idCode2,
                     name: this.user.name
                   });
                   firebase.database().ref('users-friend-request/' + idCode2).set({
                     id: user.uid,
                     idCode: idCode2,
                     name: this.user.name,
                     friendCount: 0
                   });
                  }
                  console.log("Commit data: ", snapshot);
                  this.snapLog = true;
                });
          }else{
            console.log('User already created');
          }
        })
        //Go to home page
        console.log('test');
        this.navCtrl.setRoot(Page1, {name: this.user.name});
      } else {
        // No user is signed in.
        console.log('no user signed in');
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
