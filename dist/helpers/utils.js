"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswordUtils = exports.hashPasswordUtils = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const hashPasswordUtils = async (plainPassword) => {
    try {
        return await bcrypt_1.default.hash(plainPassword, saltRounds);
    }
    catch (error) {
        console.error(error);
    }
};
exports.hashPasswordUtils = hashPasswordUtils;
const comparePasswordUtils = async (loginPassword, dbPassword) => {
    try {
        return await bcrypt_1.default.compare(loginPassword, dbPassword);
    }
    catch (error) {
        console.error(error);
    }
};
exports.comparePasswordUtils = comparePasswordUtils;
//# sourceMappingURL=utils.js.map