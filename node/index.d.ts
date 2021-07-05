declare class AasaamAES {
  private key: Buffer;

  /**
   * @param   {string} key Base64 encoded random bytes with length 32
   */
  constructor(key: string);

  /**
   * @return  {string} Base64 encoded random bytes with length 32
   */
  public static generateKey(): string;

  /**
   * @param   {string} message Message to be encrypted
   * @param   {number} ttl number of time to live in second
   *
   * @return  {string} Encrypted message with time to live
   */
  public encryptTTL(message: string, ttl: number): string;

  /**
   * @param   {string} encryptedTTLMessage Encrypted message with time to live
   *
   * @throws  {Error} If decryption failed
   *
   * @return  {any}
   */
  public decryptTTL(encryptedTTLMessage: string): any;

  /**
   * @param   {string} message Message to be encrypted
   *
   * @return  {string} Encrypted message
   */
  public encrypt(message: string): string;

  /**
   * @param   {String} encryptedMessage Encrypted message
   *
   * @throws  {Error} If decryption failed
   *
   * @return  {*}
   */
  public decrypt(encryptedMessage: string): any;
}

export default AasaamAES;
