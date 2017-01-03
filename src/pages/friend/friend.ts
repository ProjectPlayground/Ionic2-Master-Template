import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { NavController, ToastController, PopoverController } from 'ionic-angular';
import { Clipboard, BarcodeScanner } from 'ionic-native';

import * as firebase from 'firebase';

@Component({
  templateUrl: 'friend.html'
})
export class FriendPage {

  user;
  userData:any = {idCode: ""};
  
  friendCode;
  eventMes;
  @Input()friendList = [];
  testVal;
  @Input()fbRequestList;
  showMyCode;
  qrHide = true;
  @Input()friendRequestList:any[] = [];
  fbFriendList;

  ionViewWillEnter(){
    
    //get name //display name
    var user = firebase.auth().currentUser;
    var test = firebase.database().ref('users/' + user.uid);
    test.on('value', (snap:any) => {
      console.log("29: " + snap.val())
      this.userData = snap.val();
    })
  }
  
  ionViewWillUnload(){
    console.log('start off');
    this.fbRequestList.off();
    console.log('end off');
  }

  constructor(private navCtrl: NavController, public toastController: ToastController, public popoverCtrl: PopoverController, private chRef: ChangeDetectorRef) {
    this.user = firebase.auth().currentUser;
    firebase.database().ref('users/' + this.user.uid).once('value', snap => {
      this.userData = snap.val();
    })
    firebase.database().ref('users-friend-request/' + this.userData.idCode + '/requests').on('child_changed', (snap:any) =>{
      this.fbRequestList.off();
      this.friendRequestList = [];
      this.fbInit(1);
    });
    firebase.database().ref('users-friend-data/' + this.userData.idCode + '/friends').on('child_changed', (snap:any) =>{
      this.fbFriendList.off();
      this.friendList = [];
      this.fbInit(2);
    });
    this.fbInit(3);
  }

  fbInit(x){
    this.fbRequestList = firebase.database().ref('users-friend-request/' + this.userData.idCode + '/requests');
    this.fbFriendList = firebase.database().ref('users-friend-data/' + this.userData.idCode + '/friends');
    console.log("init number: " + x);
    if(x == 1 || x == 3){
      this.fbRequestList.on('child_added', (snap:any) =>{
         this.friendRequestList.push(snap.val());
         this.friendRequestList = this.friendRequestList.slice();
         this.chRef.detectChanges();
         console.log(snap.key);
         console.log("-2-");
       });
     }
     if(x == 2 || x == 3){
       this.fbFriendList.on('child_added', (snap:any) =>{
          this.friendList.push(snap.val());
          this.chRef.detectChanges();
          console.log(snap.key);
          console.log("-3-");
        });
      }
  }

  qrTog(){
    this.qrHide = !this.qrHide;
    this.chRef.detectChanges();    
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
    let myCode = myInfo.idCode;
    let myFriendCode = code;
    let fbFriendRequest = firebase.database().ref('users-friend-request/' + myFriendCode + '/requests/');
    let fbFriendCheck = firebase.database().ref('users-friend-request/' + myFriendCode + '/');

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
            }else if(snap2.val().requestState == "accepted"){
              this.eventMes = 'Request already accepted';
              this.runToast(this.eventMes);
            }
          })
        }
      })
    }
  }

  accept(code, name, id, index){
    let myInfo = this.userData;
    let myId = myInfo.id;
    let myCode = myInfo.idCode;
    let myFriendCode = code;
    let friendName = name;
    let friendId = id;
    let fbFriendData = firebase.database().ref('users-friend-data/' + myFriendCode);
    let fbMyData = firebase.database().ref('users-friend-data/' + myCode);
    let fbFriendRequest = firebase.database().ref('users-friend-request/' + myFriendCode + '/requests/' + myCode);
    let fbMyRequest = firebase.database().ref('users-friend-request/' + myCode + '/requests/' + myFriendCode);

    fbFriendRequest.set({requestState: 'accept'});
    fbMyRequest.set({requestState: 'accept'});

    fbFriendData.child("friends").child(myCode).set({
      friendCode: myCode,
      name: myInfo.name,
      id: myId
    });
    fbMyData.child("friends").child(myFriendCode).set({
      friendCode: myFriendCode,
      name: friendName,
      id: friendId
    })
    this.friendRequestList.splice(index, 1);
    this.chRef.detectChanges();
  }

  runToast(text:string){
    let toast = this.toastController.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }
}