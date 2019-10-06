import { File } from "./file.model";
import { User } from "./user.model";

export class SharedFile{
  sharedBy: User;
  sharedFile: File;
  timestamp: Date;
}