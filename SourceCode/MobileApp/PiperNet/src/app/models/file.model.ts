export class File {
  constructor(
    public name: string,
    public type: string,
    public size: string,
    public path: string,
    public isPrivate: boolean
  ) {}
}