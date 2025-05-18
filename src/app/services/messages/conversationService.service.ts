import { MessageDto } from './../../interfaces/MessageDto.interface';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { UserConversation } from '../../interfaces/UserConversation.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/enviroment';
import { BaseResponse } from '../../interfaces/BaseResponse';
import { catchError, map, of, take, tap } from 'rxjs';
import { UserToAdminMessagesServiceService } from './userToAdminMessagesService.service';
import { AuthService } from '../../auth/services/Auth.service';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private readonly BASE_URL_MSG = `${environment.baseUrl}/api/messages`;

  http = inject(HttpClient);
  userToAdminMessagesService = inject(UserToAdminMessagesServiceService);
  authService = inject(AuthService);

  private convSelected = signal<UserConversation | null>(null);
  showMessages = signal<MessageDto[] | null>(null);

  private _targetUserHash = signal<string>('');
  private ownerUserHash = signal<string>(this.authService.user()?.hash!);

  targetUserHash = computed(() => this._targetUserHash());

  hasError: boolean = false;

  constructor() {
    effect(() => {
      const conv: UserConversation | null = this.convSelected();

      if (!conv) {
        this.showMessages.set([]);
        return;
      }
      this.mergeMessages();
    });
  }

  setConvSelected(conv: UserConversation) {
    this.convSelected.update((current) => conv);
  }

  mergeMessages() {
    const messReceived = this.convSelected()?.receivedMessages;
    const messSended = this.convSelected()?.sendedMessages;
    const allMess = [...messReceived!, ...messSended!];

    const sortedMess = [...allMess].sort(this.compareSendDate('desc'));

    this.showMessages.update((current) => sortedMess);
  }

  private compareSendDate =
    (dir: 'asc' | 'desc' = 'asc') =>
    (a: MessageDto, b: MessageDto): number => {
      const missing =
        dir === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

      function parseDate(date: any): number {
        if (!date) return missing;
        // Si ya es Date y es válida
        if (date instanceof Date && !isNaN(date.getTime()))
          return date.getTime();
        // Si es string, intenta convertir a Date válida
        if (typeof date === 'string') {
          const d = new Date(date);
          return !isNaN(d.getTime()) ? d.getTime() : missing;
        }
        // Si no es nada de lo anterior, no es válido
        return missing;
      }

      const tA = parseDate(a.send_date);
      const tB = parseDate(b.send_date);

      return dir === 'asc' ? tA - tB : tB - tA;
    };

  sendMsg(content: string) {
    if (!this._targetUserHash || !this.ownerUserHash()) {
      this.hasError = true;
      setTimeout(() => {
        this.hasError = false;
      }, 2000);
      return;
    }

    const message: MessageDto = {
      senderHash: this.ownerUserHash(),
      addresseHash: this._targetUserHash(),
      content: content,
    };

    this.http
      .post<BaseResponse>(`${this.BASE_URL_MSG}/send`, message)
      .pipe(
        take(1),
        map((base) => {
          base.content as MessageDto;
        }),
        tap((mess) => console.log('Enviado correctamente: ', mess)),
        tap((mess) => this.userToAdminMessagesService.getUserConversations()),
        catchError((err) => {
          console.log('Ocurrio un error:', err);
          return of();
        })
      )
      .subscribe();
  }

  setUserTarget(value: string) {
    this._targetUserHash.update((current) => value);
    console.log('usuario actualizado');
  }
}
