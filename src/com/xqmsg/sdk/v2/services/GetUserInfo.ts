import CallMethod from "../CallMethod";
import ServerResponse from "../ServerResponse";
import XQModule from "./XQModule";
import XQSDK from "../XQSDK";

/**
 * A service which is utilized to retrieve a users information.
 *
 * @class [GetUserInfo]
 */
export default class GetUserInfo extends XQModule {
  /** The required fields of the payload needed to utilize the service */
  requiredFields: string[];

  /** Specified name of the service */
  serviceName: string;

  /** The field name representing the datetime (in milliseconds) when the subscription will end */
  static ENDS: "ends" = "ends";

  /** The field name representing the last name of the user */
  static FIRST_NAME: "firstName" = "firstName";

  /** The field name representing the id of the user*/
  static ID: "id" = "id";

  /** The field name representing the last name of the user */
  static LAST_NAME: "lastName" = "lastName";

  /** The field name representing the datetime (in milliseconds) when the subscription was activated */
  static STARTS: "starts" = "starts";

  /** The field name representing the subscription status of the user */
  static SUBSCRIPTION_STATUS: "sub" = "sub";

  /** The field name representing the user */
  static USER: "user" = "user";

  /**
   * @param {Map} [maybePayLoad=null]
   * @returns {Promise<ServerResponse<{payload:{id:long, usr:string, firstName:string, sub:string, starts:long, ends:Long}}>>}
   */
  supplyAsync: (maybePayload: null) => Promise<ServerResponse>;

  constructor(sdk: XQSDK) {
    super(sdk);

    this.serviceName = "subscriber";
    this.requiredFields = [];

    this.supplyAsync = (maybePayLoad) => {
      try {
        const accessToken = this.sdk.validateAccessToken();

        const additionalHeaderProperties = {
          Authorization: "Bearer " + accessToken,
        };

        return this.sdk.call(
          this.sdk.SUBSCRIPTION_SERVER_URL,
          this.serviceName,
          CallMethod.GET,
          additionalHeaderProperties,
          maybePayLoad,
          true
        );
      } catch (exception) {
        return new Promise((resolve) => {
          resolve(
            new ServerResponse(
              ServerResponse.ERROR,
              exception.code,
              exception.reason
            )
          );
        });
      }
    };
  }
}
