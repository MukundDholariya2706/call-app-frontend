import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @Input() contacts: any[] = [];
  @Input() activeUser: any;
  @Output() changeChat: any = new EventEmitter();

  selectedUser: number | undefined = undefined;

  constructor(
    public sanitizer: DomSanitizer,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  changeCurrentChat(index: number, contact: any) {
    this.selectedUser = index;
    this.changeChat.emit(contact);
  }

  logout() {
    this.authService.logoutUser().subscribe();
  }
}
