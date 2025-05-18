import { MessageDto } from './MessageDto.interface';
import { User } from './User.inteface';

export interface UserConversation {
  owner: User;
  alter: User;
  sendedMessages: MessageDto[];
  receivedMessages: MessageDto[];
}
