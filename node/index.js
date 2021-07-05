const crypto = require('crypto');

class AasaamAES {
  /**
   * @param   {String} key Base64 encoded random bytes with length 32
   */
  constructor(key) {
    this.key = Buffer.from(key, 'base64');
  }

  /**
   * @return  {String} Base64 encoded random bytes with length 32
   */
  static generateKey() {
    return crypto.randomBytes(32).toString('base64');
  }

  /**
   * @param   {String} message Message to be encrypted
   * @param   {Number} ttl Number of time to live in second
   *
   * @return  {String} Encrypted message with time to live
   */
  encryptTTL(message, ttl) {
    return this.encrypt(
      JSON.stringify({
        message,
        ttl: Math.round(Date.now() / 1000) + ttl,
      }),
    );
  }

  /**
   * @param   {String} encryptedTTLMessage Encrypted message with time to live
   *
   * @throws  {Error} If decryption failed
   *
   * @return  {*}
   */
  decryptTTL(encryptedTTLMessage) {
    const { message, ttl } = JSON.parse(this.decrypt(encryptedTTLMessage));
    if (ttl >= Math.round(Date.now() / 1000)) {
      return message;
    }
    return false;
  }

  /**
   * @param   {String} message Message to be encrypted
   *
   * @return  {String} Encrypted message
   */
  encrypt(message) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    let enc = cipher.update(message, 'utf8', 'base64');
    enc += cipher.final('base64');
    return [
      enc,
      iv.toString('base64'),
      cipher.getAuthTag().toString('base64'),
    ].join('.');
  }

  /**
   * @param   {String} encryptedMessage Encrypted message
   *
   * @throws  {Error} If decryption failed
   *
   * @return  {*}
   */
  decrypt(encryptedMessage) {
    const [enc, ivString, authTagString] = encryptedMessage.split('.');
    const iv = Buffer.from(ivString, 'base64');
    const authTag = Buffer.from(authTagString, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(authTag);
    let str = decipher.update(enc, 'base64', 'utf8');
    str += decipher.final('utf8');
    return str;
  }
}

module.exports = AasaamAES;
