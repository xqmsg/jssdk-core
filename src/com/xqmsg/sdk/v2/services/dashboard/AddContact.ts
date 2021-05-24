import CallMethod from "../../CallMethod";
import Destination from "../../Destination";
import ServerResponse from "../../ServerResponse";
import XQModule from "../XQModule";
import XQSDK from "../../XQSDK";

/**
 * A service which is utilized to create a new Contact for the dashboard
 *
 * @class [AddContact]
 */
export default class AddContact extends XQModule {
  /** The required fields of the payload needed to utilize the service */
  requiredFields: string[];

  /** Specified name of the service */
  serviceName: string;

  /** The field name representing the new contact's email */
  static EMAIL: "email";

  /** The field name representing the new contact's first name */
  static FIRST_NAME: "firstName";

  /** The field name representing the new contact's ID */
  static ID: "id";

  /** The field name representing the new contact's last name */
  static LAST_NAME: "lastName";

  /** The field name representing the notifications preferences for the new contact */
  static NOTIFICATIONS: "notifications";

  /** The field name representing the new contact's role */
  static ROLE: "role";

  /** The field name representing the new contact's title */
  static TITLE: "title";

  /**
   * @param {Map} maybePayLoad - Container for the request parameters supplied to this method.
   * @param {String} email - the email of the new Contact
   * @param {String} role - the role of the new Contact
   * @param {String} notifications - the notifications preference of the current user for the new Contact
   * @returns {Promise<ServerResponse<{payload:{id:int, status:string}}>>}
   */
  supplyAsync: (maybePayLoad: {
    email: string;
    role: string;
    notifications: boolean;
  }) => Promise<ServerResponse>;

  constructor(sdk: XQSDK) {
    super(sdk);
    this.serviceName = "contact";
    this.requiredFields = [
      AddContact.EMAIL,
      AddContact.ROLE,
      AddContact.NOTIFICATIONS,
    ];

    this.supplyAsync = (maybePayLoad) => {
      try {
        this.sdk.validateInput(maybePayLoad, this.requiredFields);

        const dashboardAccessToken = this.sdk.validateAccessToken(
          Destination.DASHBOARD
        );

        const additionalHeaderProperties = {
          Authorization: "Bearer " + dashboardAccessToken,
        };

        return this.sdk.call(
          this.sdk.DASHBOARD_SERVER_URL,
          this.serviceName,
          CallMethod.POST,
          additionalHeaderProperties,
          maybePayLoad,
          true,
          Destination.DASHBOARD
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
