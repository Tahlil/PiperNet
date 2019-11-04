import { File } from "./file.model";
import { User } from "./user.model";

export class SharedFile{
  constructor(
    public sharedBy: User,
    public sharedFile: File,
    public timestamp: Date
  ){}
}