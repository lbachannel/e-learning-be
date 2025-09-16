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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../modules/users/users.service");
const utils_1 = require("../helpers/utils");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(username, pass) {
        const user = await this.usersService.findUserByEmail(username);
        if (user) {
            const isCorrect = await (0, utils_1.comparePasswordUtils)(pass, user.password);
            if (!isCorrect) {
                return null;
            }
            return user;
        }
        return null;
    }
    async login(user) {
        const payload = { username: user.email, sub: user._id };
        return {
            user: {
                _id: user._id,
                email: user.email,
                name: user?.name ?? user.email
            },
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(registerDto) {
        return await this.usersService.registerAccount(registerDto);
    }
    async verify(data) {
        return await this.usersService.handleVerify(data);
    }
    async getCodeExpired(_id) {
        return await this.usersService.handleGetCodeExpired(_id);
    }
    async retryVerify(email) {
        return await this.usersService.handleRetryVerify(email);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map