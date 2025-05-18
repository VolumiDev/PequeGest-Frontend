import { UserConversation } from './UserConversation.interface';

export interface ConversationsResponse {
  conversations: {
    [key: string]: UserConversation;
  };
}
