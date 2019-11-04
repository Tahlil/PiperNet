import { File } from "./file.model";

export class GlobalFiles{
  constructor(
    public recent: File[],
    public mostSeeded: File[]
  ){}
}