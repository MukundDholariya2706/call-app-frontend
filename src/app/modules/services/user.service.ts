import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllUserList(){
    return this.http.get(environment.apiUrl + "/user/allusers");
  }

  sendUserPushNotificationEndPoint(payload: any){
    console.log('called')
    return this.http.post(environment.apiUrl + "/user/pushNotification", payload).subscribe((res: any) => {
      console.log(res, 'res')
    })
  }
}
