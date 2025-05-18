import { computed, inject, Injectable, OnInit, signal } from '@angular/core';
import { UserAuth } from '../../auth/interfaces/UserAuth.interface';
import { AuthService } from '../../auth/services/Auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/enviroment';
import { User } from '../../interfaces/User.inteface';
import { UserConversation } from '../../interfaces/UserConversation.interface';
import { BaseResponse } from '../../interfaces/BaseResponse';
import { map, take, tap } from 'rxjs';
import { ConversationsResponse } from '../../interfaces/ConversationsResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class UserToAdminMessagesServiceService {
  private readonly BASE_URL_MSG_USR = `${environment.baseUrl}/api/messages/user`;
  private readonly BASE_URL_USERS = `${environment.baseUrl}/api/user`;

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private _userTarget = signal<User | null>(null);
  private _senderUser = signal<UserAuth | null>(this.authService.user());
  private _conversations = signal<ConversationsResponse | null>(null);

  conversations = computed(() => this._conversations());

  getUserConversations() {
    this.http
      .get<BaseResponse>(
        `${this.BASE_URL_MSG_USR}/${this.authService.user()?.hash}`
      )
      .pipe(
        take(1),
        map((base) => base.content as ConversationsResponse),

        tap((conversation) => {
          console.log('debug', conversation);
          this._conversations.set(conversation);
        })
      )
      .subscribe();
  }
}
