import { TestBed } from '@angular/core/testing';

import { FileTypeIconService } from './file-type-icon.service';

describe('FileTypeIconService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileTypeIconService = TestBed.get(FileTypeIconService);
    expect(service).toBeTruthy();
  });
});
