import { File } from "./file.model";

export class LocalFiles{
  constructor(
    public uploaded: File[],
    public downloaded: File[]
  ){}
}
