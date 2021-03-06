import EncryptionAlgorithm from "../algorithms/EncryptionAlgorithm";
import FetchQuantumEntropy from "../quantum/FetchQuantumEntropy";
import GeneratePacket from "./GeneratePacket";
import ServerResponse from "../ServerResponse";
import XQModule from "./XQModule";
import XQSDK from "../XQSDK";

/**
 * A service which is utilized to encrypt data stored in a file using the {@link EncryptionAlgorithm} provided.
 *
 * @class [FileEncrypt]
 */
export default class FileEncrypt extends XQModule {
  /** The encryption algorithm used for this service */
  algorithm: EncryptionAlgorithm;

  /** The required fields of the payload needed to utilize the service */
  requiredFields: string[];

  /** The field name representing the boolean value which specifies if the content should be deleted after opening */
  static DELETE_ON_RECEIPT: "dor" = "dor";

  /** The field name representing the encrypted text */
  static ENCRYPTED_TEXT: "encryptedText" = "encryptedText";

  /** The field name representing the number of hours of life span until access to the encrypted text is expired */
  static EXPIRES_HOURS: "expires" = "expires";

  /** The field name representing the encryption key */
  static KEY: "key" = "key";

  /** The field name representing the key used to fetch the encryption key from the server */
  static LOCATOR_KEY: "locatorKey" = "locatorKey";

  /** The field name representing the list of emails of users intended to have read access to the encrypted content */
  static RECIPIENTS: "recipients" = "recipients";

  /** The field name representing the specified source file to encrypt */
  static SOURCE_FILE: "sourceFile" = "sourceFile";

  /** The field name representing the text that will be encrypted */
  static TEXT: "text" = "text";

  /**
   * @param {Map} maybePayLoad - Container for the request parameters supplied to this method.
   * @param {File} maybePayLoad.sourceFile - The file to be encrypted.
   * @param {[String]} maybePayLoad.recipients  - List of emails of users intended to have read access to the encrypted content.
   * @param {Long} maybePayLoad.expires - Life span of the encrypted content, measured in hours.
   * @param {Boolean} [maybePayLoad.dor=false] - Should the content be deleted after opening.
   *
   * @returns {Promise<ServerResponse<{payload:File}>>}
   */
  supplyAsync: (maybePayLoad: {
    sourceFile: File;
    recipients: string[];
    expires: number;
    dor: boolean;
  }) => Promise<ServerResponse>;

  constructor(sdk: XQSDK, algorithm: EncryptionAlgorithm) {
    super(sdk);

    this.algorithm = algorithm;
    this.requiredFields = [
      FileEncrypt.SOURCE_FILE,
      FileEncrypt.RECIPIENTS,
      FileEncrypt.EXPIRES_HOURS,
    ];

    this.supplyAsync = (maybePayLoad) => {
      try {
        this.sdk.validateInput(maybePayLoad, this.requiredFields);

        const algorithm = this.algorithm;
        const sdk = this.sdk;
        const deleteOnReceipt = maybePayLoad[FileEncrypt.DELETE_ON_RECEIPT];
        const expiration = maybePayLoad[FileEncrypt.EXPIRES_HOURS];
        const recipients = maybePayLoad[FileEncrypt.RECIPIENTS];
        const sourceFile = maybePayLoad[FileEncrypt.SOURCE_FILE];

        return new FetchQuantumEntropy(sdk)
          .supplyAsync({ [FetchQuantumEntropy.KS]: FetchQuantumEntropy._256 })
          .then((keyResponse) => {
            switch (keyResponse.status) {
              case ServerResponse.OK: {
                const initialKey = keyResponse.payload;
                const expandedKey = algorithm.expandKey(
                  initialKey,
                  sourceFile.size > 4096
                    ? 4096
                    : Math.max(2048, sourceFile.size)
                ) as string;

                return new GeneratePacket(sdk)
                  .supplyAsync({
                    [FileEncrypt.KEY]: algorithm.prefix + expandedKey,
                    [FileEncrypt.RECIPIENTS]: recipients,
                    [FileEncrypt.EXPIRES_HOURS]: expiration,
                    [FileEncrypt.DELETE_ON_RECEIPT]: deleteOnReceipt
                      ? deleteOnReceipt
                      : false,
                  })
                  .then((uploadResponse) => {
                    switch (uploadResponse.status) {
                      case ServerResponse.OK: {
                        const locatorToken = uploadResponse.payload;
                        return algorithm
                          .encryptFile(sourceFile, expandedKey, locatorToken)
                          .then((fileEncryptResponse: ServerResponse) => {
                            switch (fileEncryptResponse.status) {
                              case ServerResponse.OK: {
                                return fileEncryptResponse;
                              }
                              case ServerResponse.ERROR: {
                                console.error(
                                  `${algorithm.constructor.name}.encryptFile() failed, code: ${fileEncryptResponse.statusCode}, reason: ${fileEncryptResponse.payload}`
                                );
                                return fileEncryptResponse;
                              }
                              default: {
                                console.error(
                                  `${algorithm.constructor.name}.encryptFile() failed, code: ${fileEncryptResponse.statusCode}, reason: ${fileEncryptResponse.payload}`
                                );
                                return fileEncryptResponse;
                              }
                            }
                          });
                      }

                      case ServerResponse.ERROR: {
                        console.error(
                          `GeneratePacket failed, code: ${uploadResponse.statusCode}, reason: ${uploadResponse.payload}`
                        );
                        return uploadResponse;
                      }

                      default: {
                        console.error(
                          `GeneratePacket failed, code: ${uploadResponse.statusCode}, reason: ${uploadResponse.payload}`
                        );
                        return uploadResponse;
                      }
                    }
                  });
              }
              case ServerResponse.ERROR: {
                console.error(
                  `FetchQuantumEntropy failed, code: ${keyResponse.statusCode}, reason: ${keyResponse.payload}`
                );
                return keyResponse;
              }
              default: {
                console.error(
                  `FetchQuantumEntropy failed, code: ${keyResponse.statusCode}, reason: ${keyResponse.payload}`
                );
                return keyResponse;
              }
            }
          });
      } catch (validationException) {
        return new Promise((resolve) => {
          resolve(
            new ServerResponse(
              ServerResponse.ERROR,
              validationException.code,
              validationException.reason
            )
          );
        });
      }
    };
  }
}
