import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { NavController, ToastController, ModalController  } from 'ionic-angular';
import { Clipboard, BarcodeScanner, Camera } from 'ionic-native';
import { QR } from '../qr/qr';
import QrCode from 'qrcode-reader';

import * as firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';



@Component({
  templateUrl: 'friend.html'
})
export class FriendPage {

  user;
  userData:any = {idCode: ""};
  eventMes;
  friendList: FirebaseListObservable<any[]>;
  qrHide = true;
  friendRequestList: FirebaseListObservable<any[]>;
  fbFriendList;

  ionViewWillEnter(){
    //get name //display name
    var user = firebase.auth().currentUser;
    var test = firebase.database().ref('users/' + user.uid);
    test.on('value', (snap:any) => {
      this.userData = snap.val();
    })
  }

  constructor(private navCtrl: NavController, public toastController: ToastController, private chRef: ChangeDetectorRef, public af: AngularFire, public modalCtrl: ModalController) {
    this.user = firebase.auth().currentUser;
    firebase.database().ref('users/' + this.user.uid).once('value', snap => {
      this.userData = snap.val();
    })
    this.friendRequestList = af.database.list('friends/' + this.userData.id + '/requests');
    this.friendList = af.database.list('friends/' + this.userData.id + '/friends-list');

    firebase.auth().onAuthStateChanged((user) => {
      if(user == null){
        this.friendRequestList = null;
        this.friendList = null;
      }
    })

    let fbFriendData = firebase.database().ref('friends/' + this.userData.id + '/accepts/');
    let fbFriendRemove = firebase.database().ref('friends/' + this.userData.id + '/remove/');
    fbFriendRemove.on('child_added', (snap1)=>{
      var snapVal = snap1.val();
      console.log(snapVal);
      console.log(snap1);
      let fbMyData = firebase.database().ref('friends/' + this.userData.id + '/friends-list/' + snap1.key);
      let fbFriendRemove = firebase.database().ref('friends/' + this.userData.id + '/remove/' + snap1.key);      
      fbMyData.remove();
      fbFriendRemove.remove();
    })
    fbFriendData.on('child_added', (snap)=>{
      var snapVal = snap.val();
      let fbMyData = firebase.database().ref('friends/' + this.userData.id + '/friends-list/' + snap.key);
      let fbAccept = firebase.database().ref('friends/' + this.userData.id + '/accepts/' + snap.key);
      fbAccept.remove();
      fbMyData.set({
        name: snapVal.name,
        id: snapVal.id,
        state: {'val': 'offline'}
      })
    })
  }

  qrTog(){
    // this.qrHide = !this.qrHide;
   let profileModal = this.modalCtrl.create(QR, {name: this.userData.name});
   profileModal.present();
  }

  copy(){
    var text = this.userData.idCode;
    Clipboard.copy(text);
    Clipboard.paste();
    this.runToast('You can now paste your code');
  }

  scan(){
    BarcodeScanner.scan().then((barcodeData) => {
     this.enter(barcodeData.text);
    }, (err) => {
        // An error occurred
        this.runToast(err);
    });
  }

  qrImg(){
    var qr = new QrCode();
    qr.callback = (result,err) => {
       if(result) {
         this.enterFriend(result);
        }else{
          this.runToast('qr scan failed');
        } 
      }
    var options = {
      sourceType: 0,
      destinationType: 2
    }
    Camera.getPicture(options).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64:
    // let base64Image = 'data:image/jpeg;base64,' + imageData;
    qr.decode(imageData);
    }, (err) => {
    // Handle error
    });
  }

  enterFriend(name){
    var userList = firebase.database().ref('user-list/' + name);
    userList.once('value', (ul)=>{
      var val = ul.val();
      if(val != null){
        this.enter(val.id);
      }else{
        this.runToast('User does not exsist');
      }
    })
  }

  //Send Friend Request
  enter(code){
    let myInfo = this.userData;
    let myId = this.userData.id;
    let myFriendCode = code;
    let fbFriendRequest = firebase.database().ref('friends/' + myFriendCode + '/requests/');
    let fbFriendCheck = firebase.database().ref('friends/' + myFriendCode + '/metaData');
    let fbAddedCheck = firebase.database().ref('friends/' + myId + '/friends-list/' + myFriendCode);

    //Check if it's my own code
    if(myId == myFriendCode){
      this.eventMes = "This is your code.";
      this.runToast(this.eventMes);
    }else{
      //Check user exsists
      fbFriendCheck.once('value', (snap1:any) => {
        if(snap1.val() == null){
          this.eventMes = "User doesn't exsist";
          this.runToast(this.eventMes);
        }else{
          fbAddedCheck.once('value', (added)=>{
            if(added.val() != null){
              this.runToast('You are already friends');
            }else{
              //Send request
              fbFriendRequest.child(myId).once('value', (snap2:any) => {
                if(snap2.val() == null){
                  fbFriendRequest.child(myId).set({
                    requestState: "sent",
                    name: myInfo.name,
                    id: myId
                  });
                  this.eventMes = "Request sent";
                  this.runToast(this.eventMes);
                }else{
                  this.eventMes = 'Request already sent.';
                  this.runToast(this.eventMes);
                }
              })
            }
          })
        }
      })
    }
  }

  accept(name, id){
    let myName = this.userData.name;
    let myId = this.userData.id;
    let fbFriendData = firebase.database().ref('friends/' + id + '/accepts/' + myId);
    let fbMyData = firebase.database().ref('friends/' + myId + '/friends-list/' + id);
    let fbRequest = firebase.database().ref('friends/' + myId + '/requests/' + id);

    fbFriendData.set({
      name: myName,
      id: myId
    });

    fbMyData.set({
      name: name,
      id: id,
      state: { 'val': 'offline'}
    })
    
    fbRequest.remove();
  }

  decline(name, id){
    let myId = this.userData.id;
    let fbRequest = firebase.database().ref('friends/' + myId + '/requests/' + id);

    fbRequest.set({
                    requestState: "decline",
                    name: name,
                    id: myId
                  });
  }

  removeFriend(id){
    let myId = this.userData.id;
    let fbMyData = firebase.database().ref('friends/' + myId + '/friends-list/' + id);
    let fbFriendData = firebase.database().ref('friends/' + id + '/remove/' + myId);
    
    fbMyData.remove();
    fbFriendData.set({remove: myId});
  }

  runToast(text:string){
    let toast = this.toastController.create({
      message: text,
      duration: 5000
    });
    toast.present();
  }
}
