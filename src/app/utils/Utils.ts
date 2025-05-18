import { UserConversation } from '../interfaces/UserConversation.interface';
import { MessageDto } from '../interfaces/MessageDto.interface';

export function normalizeConversation(
  conv: UserConversation
): UserConversation {
  // Normaliza los mensajes enviados
  conv.sendedMessages = conv.sendedMessages.map(normalizeMessage);
  // Normaliza los mensajes recibidos
  conv.receivedMessages = conv.receivedMessages.map(normalizeMessage);
  return conv;
}

export function normalizeMessage(msg: MessageDto): MessageDto {
  // Si send_date es string, lo convertimos a Date
  if (msg.send_date && typeof msg.send_date === 'string') {
    return { ...msg, send_date: new Date(msg.send_date) };
  }
  return msg;
}
