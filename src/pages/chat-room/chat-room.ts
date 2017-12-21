import { Component } from '@angular/core';
import {IonicPage, NavParams, ToastController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
 
@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})
export class ChatRoomPage {
  messages = [];
  nickname = '';
  message = '';
  chatRoomName = '';
 
  constructor(private navParams: NavParams, private socket: Socket, private toastCtrl: ToastController) {
    this.nickname = this.navParams.get('nickname');
    this.chatRoomName = this.navParams.get('chatRoomName');
 
    this.getUsers().subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: '  + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });

    this.getMessages().subscribe((messages : Array<Object>) => {
      messages.forEach((message) => {
        this.messages.push(message);
      });
    });

    this.getMessage().subscribe(message => {
      this.messages.push(message);
    });
  }
 
  sendMessage() {
    this.socket.emit('add-message', { text: this.message, chatRoom: this.chatRoomName });
    this.message = '';
  }
 
  getMessage() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('pushAllMessages', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
 
  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }
 
  ionViewWillLeave() {
    this.socket.disconnect();
  }
 
  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit(){
    this.socket.connect();
    this.socket.emit("getAllMessages", {chatRoom : this.chatRoomName});
  }
}