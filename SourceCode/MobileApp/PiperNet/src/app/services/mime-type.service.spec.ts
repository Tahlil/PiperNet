import { TestBed } from '@angular/core/testing';

import { MimeTypeService } from './mime-type.service';

describe('MimeTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MimeTypeService = TestBed.get(MimeTypeService);
    expect(service).toBeTruthy();
  });
});
