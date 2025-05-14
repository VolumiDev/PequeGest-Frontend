export interface MessageDto {
  senderHash: string;
  addresseHash: string;
  content: string;
  send_date?: Date;
  viewed?: boolean;
  hash?: string;
  senderName?: string;
  imgURL?: string;
}
