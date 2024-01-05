import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public activeUser: any;
  public contacts: any[] = [];
  public currentChatUser: any;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.activeUser = this.authService.activeUserDetails();
    this.userService.getAllUserList().subscribe((res: any) => {
      if (res.status) {
        this.contacts = res.data;
      }
    });
  }

  handleChatChange(event: any){
    this.currentChatUser = event;
  }
}
