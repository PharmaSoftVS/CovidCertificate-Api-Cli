import * as crypto from 'crypto'
import * as fs from 'fs-extra'

export class CanonicalSha256WithRsaSigner {
  constructor(private privateKeyObject: crypto.KeyObject) {}

  sign(message: string): string {
    const canonicalMessage = CanonicalSha256WithRsaSigner.canonicalize(message)

    const bytes = Buffer.from(canonicalMessage, 'utf8')
    const sign = crypto.createSign('RSA-SHA256')
    sign.update(bytes)
    const signature = sign.sign(this.privateKeyObject)
    const base64encodedSignature = signature.toString('base64')
    return base64encodedSignature
  }

  static canonicalize(message: string): string {
    // the canonicalization regex is defined by the API
    const regex = /[\n\t ]/gm
    const canonicalMessage = message.replace(regex, '')
    return canonicalMessage
  }

  static fromKeyFile(keyFile: string): CanonicalSha256WithRsaSigner {
    const pemEncodedKey = fs.readFileSync(keyFile)
    return this.fromPemEncodedKey(pemEncodedKey)
  }

  static fromPemEncodedKey(pemEncodedKey: Buffer) {
    const privateKeyObject = crypto.createPrivateKey(pemEncodedKey)
    return new CanonicalSha256WithRsaSigner(privateKeyObject)
  }
}
