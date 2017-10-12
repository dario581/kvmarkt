import { KvmarktUserModule } from './kvmarkt-user.module';

describe('KvmarktUserModule', () => {
  let kvmarktUserModule: KvmarktUserModule;

  beforeEach(() => {
    kvmarktUserModule = new KvmarktUserModule();
  });

  it('should create an instance', () => {
    expect(kvmarktUserModule).toBeTruthy();
  });
});
