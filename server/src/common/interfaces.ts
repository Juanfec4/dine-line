export interface EmailJob {
  to: string;
  subject: string;
  html: string;
}

export interface EmailPayload {
  [key: string]: string | number;
}
