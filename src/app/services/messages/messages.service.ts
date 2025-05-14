import { FormGroup } from '@angular/forms';
import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, Observable, of, take, tap } from 'rxjs';

import { BaseResponse } from './../../interfaces/BaseResponse';
import { environment } from '../../../environment/enviroment';
import { MessageDto } from '../../interfaces/MessageDto.interface';
import { StudentDto } from '../../interfaces/StudentDto.interface';
import { AuthService } from '../../auth/services/Auth.service';
import { UserAuth } from '../../auth/interfaces/UserAuth.interface';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private readonly BASE_URL_MSG = `${environment.baseUrl}/api/messages`;
  private readonly BASE_URL_STUDENT = `${environment.baseUrl}/api/student`;

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private _studentTarget = signal<StudentDto | null>(null);
  private _targetUsersHashes = signal<string[]>([]);
  private _messages = signal<MessageDto[]>([]);
  private _senderUser = signal<UserAuth | null>(this.authService.user());

  studentTarget = computed(() => this._studentTarget());
  targetUsersHashes = computed(() => this._targetUsersHashes());
  messages = computed(() => this._messages());
  senderUser = computed(() => this._senderUser());

  private msgForm?: FormGroup;

  getConversation(senderHash: string, studentHash: string): void {
    this.http
      .get<BaseResponse>(`${this.BASE_URL_MSG}/conversation`, {
        headers: {
          senderHash: senderHash,
          studentHash: studentHash,
        },
      })
      .pipe(
        map((base) => base.content as MessageDto[]),
        tap((messages) => {
          messages.forEach((msg) => {
            if (msg.send_date && typeof msg.send_date === 'string') {
              msg.send_date = new Date(msg.send_date);
            }
          });

          messages.sort((a, b) => {
            const dateA = a.send_date ? a.send_date.getTime() : 0;
            const dateB = b.send_date ? b.send_date.getTime() : 0;
            return dateB - dateA;
          });
          this._messages.set(messages);

          this.changeViewStatus(this.getMessHashToUpdate(messages));

          console.log('msgService', this._messages());
        }),
        catchError((err) => {
          console.error('Ocurrio un error: ', err);
          return of([]);
        })
      )
      .subscribe();
  }

  getStudentTargetByHash(hash: string) {
    this.http
      .get<BaseResponse>(`${this.BASE_URL_STUDENT}/${hash}`)
      .pipe(
        take(1),
        map((base) => this._studentTarget.set(base.content as StudentDto)),
        tap((stu) => console.log('Sturndet', stu))
      )
      .subscribe();
  }

  addTargetUserHash(hash: string) {
    this._targetUsersHashes.update((list) =>
      list.includes(hash) ? list : [...list, hash]
    );
    this.msgForm?.updateValueAndValidity();
  }

  removeTargetUserHash(hash: string) {
    this._targetUsersHashes.update((list) => list.filter((h) => h !== hash));
    this.msgForm?.updateValueAndValidity();
  }

  setTargetUsersHash(hashes: string[]): void {
    this._targetUsersHashes.update((current) => hashes);
  }

  sendMessage(content: string) {
    console.log('sender:', this._senderUser());
    console.log('receivers:', this._targetUsersHashes());
    console.log('content:', content);

    this._targetUsersHashes().forEach((target) => {
      const msg: MessageDto = {
        senderHash: this._senderUser()!.hash,
        addresseHash: target,
        content: content,
      };

      this.http
        .post<BaseResponse>(`${this.BASE_URL_MSG}/send`, msg)
        .pipe(
          take(1),
          map((base) => {
            base.content as MessageDto;
          }),
          tap((mess) => console.log('Enviado correctamente: ', mess)),
          tap(() =>
            this.getConversation(
              this._senderUser()?.hash!,
              this.studentTarget()?.hash!
            )
          ),
          catchError((err) => {
            console.log('Ocurrio un error:', err);
            return of();
          })
        )
        .subscribe();
    });
  }

  setMsgForm(formGroup: FormGroup) {
    this.msgForm = formGroup;
  }

  reValidateForm(formGroup: FormGroup) {
    formGroup.updateValueAndValidity();
  }

  changeViewStatus(messHashes: string[]) {
    console.log('mess hashes', messHashes);

    this.http
      .post<BaseResponse>(`${this.BASE_URL_MSG}/changeViewStatus`, messHashes)
      .pipe(
        take(1),
        map((base) => base.content as MessageDto),
        tap(() => console.log('Estados actualizados'))
      )
      .subscribe();
  }
  getMessHashToUpdate(messages: MessageDto[]): string[] {
    const hashesList: string[] = [];

    messages.forEach((mess) => {
      if (mess.senderHash !== this._senderUser()?.hash) {
        hashesList.push(mess.hash!);
      }
    });
    return hashesList;
  }
}
