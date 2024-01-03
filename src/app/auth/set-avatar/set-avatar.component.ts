import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-set-avatar',
  templateUrl: './set-avatar.component.html',
  styleUrls: ['./set-avatar.component.scss'],
})
export class SetAvatarComponent implements OnInit {
  avatars: string[] = [];
  selectedAvatar: number | undefined = undefined;
  isAvatarsLoad: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getProfileImages();
  }

  async getProfileImages() {
    this.isAvatarsLoad = false;
    this.avatars = (await this.authService.getAvatarImages()) as string[];
    this.isAvatarsLoad = true;
  }

  refreshAvatar() {
    this.selectedAvatar = undefined;
    this.getProfileImages();
  }

  setSelectedAvatar(index: number) {
    this.selectedAvatar = index;
  }

  setAvatar() {
    if (this.selectedAvatar != undefined) {
      this.authService
        .setProfileAvatar({
          image: Object.values(this.avatars[this.selectedAvatar])[0],
        })
        .subscribe((res: any) => {
          console.log(res, 'res');
        });
    }
  }
}
