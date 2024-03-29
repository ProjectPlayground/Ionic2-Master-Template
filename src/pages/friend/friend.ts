import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { NavController, ToastController, ModalController  } from 'ionic-angular';
import { Clipboard, BarcodeScanner, Camera } from 'ionic-native';
import { QR } from '../qr/qr';
import QrCode from 'qrcode-reader';

import * as firebase from 'firebase';
import { AngularFire } from 'angularfire2';


@Input()
@Component({
  templateUrl: 'friend.html'
})
export class FriendPage {

  user;
  userData:any = {idCode: ""};
  eventMes;
  friendList;
  qrHide = true;
  friendRequestList;
  fbFriendList;

  ionViewWillEnter(){
    //get name //display name
    var user = firebase.auth().currentUser;
    var test = firebase.database().ref('users/' + user.uid);
    test.on('value', (snap:any) => {
      this.userData = snap.val();
      this.friendRequestList = this.af.database.list('friends/' + this.userData.id + '/requests');
      this.friendList = this.af.database.list('friends/' + this.userData.id + '/friends-list');
    })
  }

  constructor(private navCtrl: NavController, public toastController: ToastController, private chRef: ChangeDetectorRef, public af: AngularFire, public modalCtrl: ModalController) {
    this.user = firebase.auth().currentUser;
    firebase.database().ref('users/' + this.user.uid).once('value', snap => {
      this.userData = snap.val();
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
    let fbFriendData = this.af.database.object('friends/' + id + '/friends-list/' + myId);
    let fbMyData = this.af.database.object('friends/' + myId + '/friends-list/' + id);
    let fbRequest = this.af.database.object('friends/' + myId + '/requests/' + id);

    fbFriendData.set({
      name: myName,
      id: myId,
      state: {'val': 'online'}
    });

    fbMyData.set({
      name: name,
      id: id,
      state: {'val': 'offline'}
    })

    fbRequest.remove();
    
  }

  decline(name, id){
    let myId = this.userData.id;
    let fbRequest = this.af.database.object('friends/' + myId + '/requests/' + id);

    fbRequest.set({
                    requestState: "decline",
                    name: name,
                    id: myId
                  });
  }

  removeFriend(id){
    let myId = this.userData.id;
    let fbMyData = this.af.database.object('friends/' + myId + '/friends-list/' + id);
    let fbFriendData = this.af.database.object('friends/' + id + '/friends-list/' + myId);
    
    fbMyData.remove();
    fbFriendData.remove();
  }

  runToast(text:string){
    let toast = this.toastController.create({
      message: text,
      duration: 5000
    });
    toast.present();
  }
}