import { randomUUID } from 'node:crypto';
import { MijnProductenClient } from '../MijnProductenClient';


test('Load product', async () => {
  const client = new MijnProductenClient();
  expect((await client.getProduct(randomUUID())).uuid).toEqual('12126e1e-9bc1-4a30-b73e-5b5aa4ce8bc4');
});