export class File {
  constructor(
    public name: string,
    public mtime: number,
    public type: string,
    public size: string,
    public path: string,
    public isPrivate: boolean
  ) {}
}