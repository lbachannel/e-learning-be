"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const sendEmailUtils_1 = __importDefault(require("../../helpers/sendEmailUtils"));
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let MailService = class MailService {
    resend;
    constructor() {
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    }
    async sendActivationMail(email, name, uuid) {
        try {
            const html = (0, sendEmailUtils_1.default)("register", {
                name: name ?? email,
                activationCode: uuid,
            });
            const response = await this.resend.emails.send({
                from: "onboarding@resend.dev",
                to: email,
                subject: "E-Learning App - Activate your account ✔",
                html,
            });
            console.log("Mail sent:", response);
            return response;
        }
        catch (error) {
            console.error("Failed to send mail:", error);
            throw error;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map