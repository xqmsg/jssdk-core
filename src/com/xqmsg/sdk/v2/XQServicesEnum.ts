export enum XQServices {
  Authorize = "Authorize",
  AuthorizeAlias = "AuthorizeAlias",
  AuthorizeDelegate = "AuthorizeDelegate",
  CheckApiKey = "CheckApiKey",
  CheckKeyExpiration = "CheckKeyExpiration",
  CodeValidator = "CodeValidator",
  CombineAuthorizations = "CombineAuthorizations",
  Decrypt = "Decrypt",
  DeleteAuthorization = "DeleteAuthorization",
  DeleteSubscriber = "DeleteSubscriber",
  Encrypt = "Encrypt",
  EncryptionAlgorithm = "EncryptionAlgorithm",
  ExchangeForAccessToken = "ExchangeForAccessToken",
  FetchKey = "FetchKey",
  FetchQuantumEntropy = "FetchQuantumEntropy",
  FileDecrypt = "FileDecrypt",
  FileEncrypt = "FileEncrypt",
  GeneratePacket = "GeneratePacket",
  GetSettings = "GetSettings",
  GetSubscriberInfo = "GetSubscriberInfo",
  GrantUserAccess = "GrantUserAccess",
  RevokeKeyAccess = "RevokeKeyAccess",
  RevokeUserAccess = "RevokeUserAccess",
  UpdateSettings = "UpdateSettings",

  // Dashboard services
  AddApplication = "AddApplication",
  AddBusiness = "AddBusiness",
  AddContact = "AddContact",
  AddUserGroup = "AddUserGroup",
  DashboardLogin = "DashboardLogin",
  DisableContact = "DisableContact",
  FindUserGroups = "FindUserGroups",
  GetApplications = "GetApplications",
  GetBusinesses = "GetBusinesses",
  GetCommunications = "GetCommunications",
  GetContacts = "GetContacts",
  GetCurrentBusiness = "GetCurrentBusiness",
  GetCurrentUser = "GetCurrentUser",
  GetEventLogs = "GetEventLogs",
  GetEventTypes = "GetEventTypes",
  GetTrustedRanges = "GetTrustedRanges",
  GetWorkspaces = "GetWorkspaces",
  RemoveApplication = "RemoveApplication",
  RemoveContact = "RemoveContact",
  RemoveUserGroup = "RemoveUserGroup",
  UpdateApplication = "UpdateApplication",
  UpdateBusiness = "UpdateBusiness",
  UpdateUserGroup = "UpdateUserGroup",
  ValidateSession = "ValidateSession",
  VerifyAccount = "VerifyAccount",
}

export enum XQEncryptionAlgorithms {
  AESEncryption = "AESEncryption",
  OTPv2Encryption = "OTPv2Encryption",
}
