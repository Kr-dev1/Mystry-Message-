import { Message } from "@/model/UserModel";

export interface Apiresponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
