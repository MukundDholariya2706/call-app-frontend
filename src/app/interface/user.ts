import { BaseModel } from './base-model';

export interface User extends BaseModel {
  username: string;
  email: string;
  password?: string;
  profileImage?: string;
  isAvatarImageSet: boolean;
  is_google_login: boolean;
  is_facebook_login: boolean;
  isOnline: boolean;
  push_notification_endpoint?: any;
  token?: string;
}
