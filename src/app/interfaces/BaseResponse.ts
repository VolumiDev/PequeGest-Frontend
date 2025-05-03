import { Status } from './Status';

export interface BaseResponse {
  status: Status;
  content: Object;
}
