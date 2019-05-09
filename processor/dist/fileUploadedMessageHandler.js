"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("./infrastructure/config"));
var logging_1 = __importDefault(require("./infrastructure/logging"));
var DriveAuth_1 = __importDefault(require("./services/DriveAuth"));
var DriveClient_1 = __importDefault(require("./services/DriveClient"));
var FileUploadedMessageHandler = /** @class */ (function () {
    function FileUploadedMessageHandler(userRepository) {
        this.userRepository = userRepository;
    }
    FileUploadedMessageHandler.prototype.handle = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var user, driveAuth, driveClient, _a, file, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.userRepository.getUser(message.userId)];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            logging_1.default.warn("Unknown user: " + message.userId);
                            return [2 /*return*/];
                        }
                        driveAuth = new DriveAuth_1.default(config_1.default.driveApiKey, config_1.default.driveApiSecret, this.userRepository);
                        _a = DriveClient_1.default.bind;
                        return [4 /*yield*/, driveAuth.getToken(user)];
                    case 2:
                        driveClient = new (_a.apply(DriveClient_1.default, [void 0, _b.sent(), driveAuth.getOAuth()]))();
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, driveClient.getFile(message.fileId)];
                    case 4:
                        file = _b.sent();
                        if (!this.isMeme(file)) {
                            logging_1.default.info("File " + 0 + " is not a meme", message.fileId);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, driveClient.copyFile(message.fileId, user.folderId)];
                    case 5:
                        _b.sent();
                        // await driveClient.deletefile(fileId);
                        logging_1.default.info("Copied to memes!");
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _b.sent();
                        logging_1.default.warn("Unknown file: " + message.fileId);
                        return [3 /*break*/, 7];
                    case 7: return [4 /*yield*/, message.complete()];
                    case 8:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FileUploadedMessageHandler.prototype.isMeme = function (file) {
        var format = /^IMG_[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])_(2[0-3]|[01][0-9])[0-5][0-9][0-6][0-9].jpg$/;
        if (format.test(file.originalFilename || "")) {
            return false;
        }
        if (!file.imageMediaMetadata) {
            return false;
        }
        if (file.imageMediaMetadata.cameraMake) {
            return false;
        }
        return true;
    };
    return FileUploadedMessageHandler;
}());
exports.default = FileUploadedMessageHandler;
