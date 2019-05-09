"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(id, accessToken, refreshToken, tokenExpiryDate, folderId) {
        this.id = id;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenExpiryDate = tokenExpiryDate;
        this.folderId = folderId;
    }
    return User;
}());
exports.default = User;
