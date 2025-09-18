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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const utils_1 = require("../../helpers/utils");
const api_query_params_1 = __importDefault(require("api-query-params"));
const mongoose_3 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const dayjs_1 = __importDefault(require("dayjs"));
const sendEmailUtils_1 = __importDefault(require("../../helpers/sendEmailUtils"));
const resend_1 = require("resend");
let UsersService = class UsersService {
    userModel;
    resend;
    constructor(userModel, resend) {
        this.userModel = userModel;
        this.resend = resend;
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    }
    isEmailExist = async (email) => {
        const user = await this.userModel.exists({ email });
        return user ? true : false;
    };
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
    async create(createUserDto) {
        const { name, email, password } = createUserDto;
        const isExistEmail = await this.isEmailExist(email);
        if (isExistEmail) {
            throw new common_1.BadRequestException(`Email: ${email} already exists. Please use another one`);
        }
        const hashPassword = await (0, utils_1.hashPasswordUtils)(password);
        const user = await this.userModel.create({
            name, email, password: hashPassword
        });
        return {
            _id: user.id
        };
    }
    validateCurrentAndPageSize = (current, pageSize) => {
        if (typeof current !== 'number' || isNaN(current)) {
            throw new common_1.BadRequestException(`current value is invalid.`);
        }
        if (typeof pageSize !== 'number' || isNaN(pageSize)) {
            throw new common_1.BadRequestException(`pageSize value is invalid`);
        }
    };
    async findAll(query, current, pageSize) {
        const { sort } = (0, api_query_params_1.default)(query);
        this.validateCurrentAndPageSize(current, pageSize);
        if (!current) {
            current = 1;
        }
        if (!pageSize) {
            pageSize = 10;
        }
        const totalItem = await this.userModel.countDocuments();
        const totalPage = Math.ceil(totalItem / pageSize);
        const offset = (current - 1) * (pageSize);
        const userList = await this.userModel
            .find()
            .limit(pageSize)
            .skip(offset)
            .select('-password')
            .sort(sort);
        return { userList, totalPage };
    }
    findOne(id) {
        return `This action returns a #${id} user`;
    }
    async findUserByEmail(email) {
        return await this.userModel.findOne({ email });
    }
    async update(updateUserDto) {
        return await this.userModel.updateOne({ _id: updateUserDto._id }, { name: updateUserDto.name });
    }
    async remove(_id) {
        if (mongoose_3.default.isValidObjectId(_id)) {
            const result = await this.userModel.deleteOne({ _id });
            if (result.acknowledged && result.deletedCount === 0) {
                throw new common_1.NotFoundException(`User with id: ${_id} does not exist`);
            }
            return result;
        }
        throw new common_1.BadRequestException(`Id: ${_id} is invalid`);
    }
    async registerAccount(registerDto) {
        const { name, email, password } = registerDto;
        const isExistEmail = await this.isEmailExist(email);
        if (isExistEmail) {
            throw new common_1.BadRequestException(`Email: ${email} already exists. Please use another one`);
        }
        const hashPassword = await (0, utils_1.hashPasswordUtils)(password);
        const uuid = (0, uuid_1.v4)();
        const user = await this.userModel.create({
            name, email, password: hashPassword, isActive: false, codeId: uuid, codeExpired: (0, dayjs_1.default)().add(5, 'minutes')
        });
        await this.sendActivationMail(user?.email, user?.name, uuid);
        return { _id: user._id, codeExpired: user.codeExpired };
    }
    async handleVerify(req) {
        const user = await this.userModel.findOne({
            _id: req._id,
            codeId: req.code
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid verification code.');
        }
        const isNotExpired = (0, dayjs_1.default)().isBefore(user.codeExpired);
        if (isNotExpired) {
            await this.userModel.updateOne({ _id: user._id }, { isActive: true });
        }
        else {
            throw new common_1.BadRequestException('The verification code has expired.');
        }
    }
    async handleGetCodeExpired(_id) {
        const user = await this.userModel.findOne({
            _id: _id
        });
        return { codeExpired: user?.codeExpired };
    }
    async handleRetryVerify(email) {
        const user = await this.userModel.findOne({ email: email });
        if (!user) {
            throw new common_1.BadRequestException(`Email: ${email} does not exists`);
        }
        if (user.isActive) {
            throw new common_1.BadRequestException(`Email: ${email} has been activated `);
        }
        const uuid = (0, uuid_1.v4)();
        await user.updateOne({
            codeId: uuid,
            codeExpired: (0, dayjs_1.default)().add(5, 'minutes')
        });
        await this.sendActivationMail(user?.email, user?.name, uuid);
        return { _id: user?._id };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        resend_1.Resend])
], UsersService);
//# sourceMappingURL=users.service.js.map