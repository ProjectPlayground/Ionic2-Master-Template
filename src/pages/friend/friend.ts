import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { NavController, ToastController, PopoverController } from 'ionic-angular';
import { Clipboard, BarcodeScanner } from 'ionic-native';

import * as firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  templateUrl: 'friend.html'
})
export class FriendPage {

  user;
  userData:any = {idCode: ""};
  
  friendCode;
  eventMes;
  friendList: FirebaseListObservable<any[]>;
  testVal;
  fbRequestList;
  showMyCode;
  qrHide = true;
  friendRequestList: FirebaseListObservable<any[]>;
  fbFriendList;

  ionViewWillEnter(){
    //get name //display name
    var user = firebase.auth().currentUser;
    var test = firebase.database().ref('users/' + user.uid);
    test.on('value', (snap:any) => {
      console.log("31: " + snap.val());
      console.log(snap.key);
      this.userData = snap.val();
    })
  }

  constructor(private navCtrl: NavController, public toastController: ToastController, public popoverCtrl: PopoverController, private chRef: ChangeDetectorRef, public af: AngularFire) {
    this.user = firebase.auth().currentUser;
    firebase.database().ref('users/' + this.user.uid).once('value', snap => {
      this.userData = snap.val();
    })
    this.friendRequestList = af.database.list('friends/' + this.userData.id + '/requests');
    this.friendList = af.database.list('friends/' + this.userData.id + '/friends-list');

    let fbFriendData = firebase.database().ref('friends/' + this.userData.id + '/accepts/');
    fbFriendData.on('child_added', (snap)=>{
      var test = snap.val();
      console.log(test);
      console.log(snap.val);
      let fbMyData = firebase.database().ref('friends/' + this.userData.id + '/friends-list/' + snap.key);
      let fbAccept = firebase.database().ref('friends/' + this.userData.id + '/accepts/' + snap.key);
      fbAccept.remove();
      fbMyData.set({
        friendCode: test.id,
        name: test.name,
        id: test.id
      })
    })
  }

  qrTog(){
    this.qrHide = !this.qrHide;   
  }

  copy(){
    var text = this.userData.idCode;
    console.log(text);
    Clipboard.copy(text);
    Clipboard.paste();
    this.runToast('You can now paste your code');
  }

  scan(){
    BarcodeScanner.scan().then((barcodeData) => {
     this.enterFriend(barcodeData.text);
    }, (err) => {
        // An error occurred
        this.runToast(err);
    });
  }

  //Send Friend Request
  enterFriend(code){
    let myInfo = this.userData;
    let myId = this.userData.id;
    let myCode = myInfo.id;
    let myFriendCode = code;
    let fbFriendRequest = firebase.database().ref('friends/' + myFriendCode + '/requests/');
    let fbFriendCheck = firebase.database().ref('friends/' + myFriendCode + '/metaData');
    let fbAddedCheck = firebase.database().ref('friends/' + myCode + '/friends-list/' + myFriendCode);

    //Check if it's my own code
    if(myCode == myFriendCode){
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
              fbFriendRequest.child(myCode).once('value', (snap2:any) => {
                if(snap2.val() == null){
                  fbFriendRequest.child(myCode).set({
                    requestState: "sent",
                    friendCode: myCode,
                    name: myInfo.name,
                    id: myId
                  });
                  this.eventMes = "Request sent";
                  this.runToast(this.eventMes);
                }else if(snap2.val().requestState == "sent"){
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

  accept(code, name, id, index){
    let myInfo = this.userData;
    let myId = myInfo.id;
    let myCode = myInfo.id;
    let myFriendCode = code;
    let friendName = name;
    let friendId = id;
    let fbFriendData = firebase.database().ref('friends/' + myFriendCode + '/accepts/' + myCode);
    let fbMyData = firebase.database().ref('friends/' + myCode + '/friends-list/' + myFriendCode);
    let fbRequest = firebase.database().ref('friends/' + myCode + '/requests/' + myFriendCode);

    fbFriendData.set({
      friendCode: myId,
      name: this.userData.name,
      id: myId
    });

    fbMyData.set({
      friendCode: myFriendCode,
      name: friendName,
      id: friendId
    })
    
    fbRequest.remove();
  }

  runToast(text:string){
    let toast = this.toastController.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }
}
