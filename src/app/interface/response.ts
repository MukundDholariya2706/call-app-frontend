export interface Response<T = any> {
  status: boolean;
  message: string;
  error?: string;
  data?: T;
}
