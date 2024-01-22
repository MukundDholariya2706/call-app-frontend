export interface Response<T> {
  status: boolean;
  message: string;
  error?: string;
  data?: T;
}
