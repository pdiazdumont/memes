"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileUploadedMessage = /** @class */ (function () {
    function FileUploadedMessage(fileId, userId, complete) {
        this.fileId = fileId;
        this.userId = userId;
        this.complete = complete;
    }
    return FileUploadedMessage;
}());
exports.default = FileUploadedMessage;
