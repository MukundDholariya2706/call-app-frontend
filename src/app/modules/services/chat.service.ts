import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getChatHistory(id: string){
    return this.http.get(environment.apiUrl + '/user/chatHistory/' + id);
  }

  sendMessageToUser(payload: any){
    return this.http.post(environment.apiUrl + '/user/sendMessageToUser', payload).subscribe();
  }
  
}
