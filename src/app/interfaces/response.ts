export default interface Response<T> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
  stack?: string | null;
}
