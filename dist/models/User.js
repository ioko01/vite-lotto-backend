"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TUserStatusEnum = exports.TUserRoleEnum = void 0;
var TUserRoleEnum;
(function (TUserRoleEnum) {
    TUserRoleEnum["ADMIN"] = "ADMIN";
    TUserRoleEnum["AGENT"] = "AGENT";
    TUserRoleEnum["MANAGER"] = "MANAGER";
    TUserRoleEnum["MEMBER"] = "MEMBER";
    TUserRoleEnum["MANAGE_REWARD"] = "MANAGE_REWARD";
})(TUserRoleEnum = exports.TUserRoleEnum || (exports.TUserRoleEnum = {}));
var TUserStatusEnum;
(function (TUserStatusEnum) {
    TUserStatusEnum["REGULAR"] = "REGULAR";
    TUserStatusEnum["CLOSED"] = "CLOSED";
    TUserStatusEnum["BANNED"] = "BANNED";
})(TUserStatusEnum = exports.TUserStatusEnum || (exports.TUserStatusEnum = {}));
