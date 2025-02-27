export interface BaseResponse {
  code: string;
  message: string;
}

export class BaseResponse {
  code!: string;
  message!: string;
}
