/* eslint-env jest */
const fs = require('fs').promises;

const AasaamAES = require('.');

describe('aasaamAES', () => {
  it('global mode', async () => {
    expect(AasaamAES.generateKey()).toBeTruthy();
  });
  it('global mode', async () => {
    const test = JSON.parse(
      await fs.readFile(`${__dirname}/../test.json`, { encoding: 'utf-8' }),
    );
    const aes = new AasaamAES(test.key);
    const encryptedTTLMessage = aes.encryptTTL(test.message, 1);
    const decrypted1 = aes.decryptTTL(encryptedTTLMessage);
    expect(decrypted1).toEqual(test.message);
    await new Promise((r) => setTimeout(r, 2000));
    const decrypted2 = aes.decryptTTL(encryptedTTLMessage);
    expect(decrypted2).toBe(false);
    const errorDecrypt1 = () => {
      aes.decryptTTL('');
    };
    expect(errorDecrypt1).toThrow();
    const errorDecrypt2 = () => {
      aes.decryptTTL('a.b.c');
    };
    expect(errorDecrypt2).toThrow();
  });
});
