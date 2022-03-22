import jwtDecode, { JwtPayload } from "jwt-decode";

import CallMethod from "../../CallMethod";
import Destination from "../../Destination";
import ServerResponse from "../../ServerResponse";
import XQModule from "../XQModule";
import XQSDK from "../../XQSDK";

/**
 * A service utilized to verify a user via their `accessToken` and allow access to Dashboard services.
 * @class [DashboardLogin]
 */
export default class VerifyAccount extends XQModule {
  /** The required fields of the payload needed to utilize the service */
  requiredFields: string[];

  /** Specified name of the service */
  serviceName: string;

  /** The field name representing an access token */
  static ACCESS_TOKEN: "accessToken" = "accessToken";

  /**
   * @param {Map} maybePayLoad - the container for the request parameters supplied to this method.
   * @param {String} maybePayLoad.accesstoken - the provided access token
   * @returns {Promise<ServerResponse<{payload:string}>>}
   */
  supplyAsync: (maybePayload: {
    [VerifyAccount.ACCESS_TOKEN]: string;
  }) => Promise<ServerResponse>;

  constructor(sdk: XQSDK) {
    super(sdk);
    this.serviceName = "login/verify";
    this.requiredFields = [VerifyAccount.ACCESS_TOKEN];

    this.supplyAsync = (maybePayLoad) => {
      try {
        const self = this;

        const preAccessToken = maybePayLoad[VerifyAccount.ACCESS_TOKEN];

        const additionalHeaderProperties = {
          Authorization: `Bearer ${preAccessToken}`,
        };

        return this.sdk
          .call(
            this.sdk.DASHBOARD_SERVER_URL,
            this.serviceName,
            CallMethod.GET,
            additionalHeaderProperties,
            null,
            true,
            Destination.DASHBOARD
          )
          .then(async (exchangeResponse: ServerResponse) => {
            switch (exchangeResponse.status) {
              case ServerResponse.OK: {
                const dashboardAccessToken = exchangeResponse.payload;
                try {
                  const decodedJWTPayload: JwtPayload = jwtDecode(
                    exchangeResponse.payload
                  );

                  const profile = decodedJWTPayload.sub;

                  await self.cache.putActiveProfile(profile);

                  const activeProfile = self.cache.getActiveProfile(true);

                  self.cache.putDashboardAccess(
                    activeProfile,
                    dashboardAccessToken
                  );
                  return exchangeResponse;
                } catch (e) {
                  console.log(e);
                  return null;
                }
              }
              case ServerResponse.ERROR: {
                console.error(
                  `VerifyAccount failed, code: ${exchangeResponse.statusCode}, reason: ${exchangeResponse.payload}`
                );
                return exchangeResponse;
              }
            }
          });
      } catch (exc) {
        return new Promise((resolve) => {
          resolve(
            new ServerResponse(ServerResponse.ERROR, exc.code, exc.reason)
          );
        });
      }
    };
  }
}
