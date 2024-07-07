import { TestBed } from '@angular/core/testing';

import { DexieDbService } from './dexie-db.service';

describe('DexieDbService', () => {
  let service: DexieDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DexieDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
