import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  nickname = '';
  chatRooms = [];
  chatRoomName = '';
  selectedChatRoom = '';
 
  constructor(public navCtrl: NavController, private socket: Socket, public popoverCtrl: PopoverController) { 
    this.getChatRooms().subscribe((chatRooms : Array<Object>) => {
      chatRooms.forEach((chatRoom) => {
        this.chatRooms.push(chatRoom);
      });
    });

    this.getChatRoom().subscribe(chatRoom => {
      this.chatRooms.push(chatRoom);
    });
  };

  getChatRoom() {
    let observable = new Observable(observer => {
      this.socket.on('chatRoom', (data) => {
        observer.next(data);
      });
    })
    return observable;
  };

  getChatRooms() {
    let observable = new Observable(observer => {
      this.socket.on('pushAllChatRooms', (data) => {
        observer.next(data);
      });
    })
    return observable;
  };

  addChatRoom(){
    this.socket.emit('createChatRoom', { name: this.chatRoomName });
    this.chatRoomName = '';
  };
 
  joinChat() {
    this.socket.connect();
    this.socket.emit('set-nickname', this.nickname);
    this.socket.emit('set-chatRoomName', this.chatRoomName);
    this.navCtrl.push('ChatRoomPage', { nickname: this.nickname, chatRoomName: this.selectedChatRoom});
  };
  
  ngOnInit(){
    this.socket.connect();
    this.socket.emit("getAllChatRooms");
  }
}