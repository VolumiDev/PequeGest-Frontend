import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { take } from 'rxjs';

import { AuthService } from '../../../../../../../auth/services/Auth.service';
import { InputChatMessageComponent } from '../../../../../../../shared/components/inputChatMessage/inputChatMessage.component';
import { MessageBoxComponent } from '../../../../../../../shared/components/messageBox/messageBox.component';
import { MessagesService } from '../../../../../../../services/messages/messages.service';
import { ParentDto } from '../../../../../../../interfaces/ParentDto.interface';
import { UserStudentTableService } from '../../../../../../../services/student.services/usersStudentTable.service';

@Component({
  selector: 'app-student-chat',
  imports: [MessageBoxComponent, InputChatMessageComponent],
  templateUrl: './studentChat.component.html',
})
export class StudentChatComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    this.route
      .parent!.paramMap.pipe(take(1)) // solo una emisión
      .subscribe((params) => {
        const stuHash = params.get('studentHash')!;
        this.studentHash = stuHash;
        const senderHash = this.userAuthenticated()!.hash;

        this.messagesService.getStudentTargetByHash(this.studentHash);

        this.msgService.getConversation(senderHash, stuHash);
      });
  }

  ngOnDestroy(): void {
    this.msgService.setTargetUsersHash([]);
  }

  private route = inject(ActivatedRoute);
  private messagesService = inject(MessagesService);
  private studentService = inject(UserStudentTableService);
  private authService = inject(AuthService);

  studentHash: string = '';
  isIncluded: boolean = false;
  isRemoved: boolean = false;

  userAuthenticated = this.authService.user;

  get msgService() {
    return this.messagesService;
  }

  addDestinatary(parent: ParentDto) {
    if (this.msgService.targetUsersHashes().includes(parent.hash!)) {
      this.msgService.removeTargetUserHash(parent.hash!);
      this.flash('removed');
    } else {
      if (this.msgService.studentTarget()?.doubleAuthorization) {
        this.msgService
          .studentTarget()
          ?.parentsDto.forEach((p) =>
            this.msgService.addTargetUserHash(p.hash!)
          );
      } else {
        this.msgService.addTargetUserHash(parent.hash!);
      }
      this.flash('included');
    }
  }

  private flash(type: 'included' | 'removed') {
    this.isIncluded = type === 'included';
    this.isRemoved = type === 'removed';
    setTimeout(() => {
      this.isIncluded = this.isRemoved = false;
    }, 2000);
  }

  isOnList(hash: string) {
    if (this.msgService.targetUsersHashes().includes(hash)) {
      return true;
    }
    return false;
  }
}
