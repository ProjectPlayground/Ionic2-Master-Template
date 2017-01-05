import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, ModalController, MenuController, NavParams, Platform } from 'ionic-angular';
import { CanvasPage } from '../canvas/canvas';
import { Camera } from 'ionic-native';

import * as firebase from 'firebase';

import { BadWords } from '../../assets/providers/bad-words/bad-words';

@Component({
  templateUrl: 'page1.html',
  providers: [BadWords]
})
export class Page1 {
  name = " ";
  userData;
  myImg='assets/default-user.jpg';
  fbUser;
  tester = false;

  test(){
    this.navCtrl.push(CanvasPage);
  }
  test2(){
    this.tester = !this.tester;
    var x:any = BadWords;
    this.badWords.clean('gofuckyourself').then((word) => {
      console.log(word);
    });
  }

  ionViewWillEnter(){
    var user = firebase.auth().currentUser;
    this.fbUser = firebase.database().ref('users/' + user.uid);
    this.fbUser.on('value', (snap:any) => {
      this.userData = snap.val();
      if(this.userData){
        this.name = snap.val().name;
        this.chRef.detectChanges();
      }
    })
  }

  constructor(public navCtrl: NavController,
    private badWords: BadWords,
    private navParams: NavParams,
    public modalCtrl: ModalController,
    public menu: MenuController,
    public platform: Platform,
    private chRef: ChangeDetectorRef
    ) {
      platform.ready().then((readySource) => {
      console.log('Platform ready from', readySource);

    });
  }

  camera(){
    //Camera photo capture
    var options = {
        quality: 100,
        targetHeight: 150,
        targetWidth: 150,
        destinationType: Camera.DestinationType.DATA_URL,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: 1,
        encodingType: Camera.EncodingType.PNG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    Camera.getPicture(options).then((imageData) => {
    alert(imageData);
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/png;base64,' + imageData;
     this.myImg = base64Image;
      //  this.fbUser.update({img: base64Image});
      var ref = firebase.storage().ref();
      var storageRef = ref.child('/images/mountains.png');
      storageRef.putString(imageData, 'base64', {contentType: 'image/png'}).then((snapshot) => {
        console.log('Uploaded a base64 string!');
        alert(snapshot);
      });
      alert('Alert!');
    }, (err) => {
     // Handle error
     alert(err);
    });
  }

    //request a match
    request(){
      var test:any = firebase.database().ref('test').orderByValue();
      test.once('value')
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          console.log(childSnapshot.key);
          console.log(childSnapshot.val());
      })
    })
  }
}
