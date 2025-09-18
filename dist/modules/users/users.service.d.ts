import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { RegisterAuthDto } from '@/auth/dto/register-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyAuthDto } from '@/auth/dto/verify-auth.dto';
export declare class UsersService {
    private userModel;
    private readonly mailerService;
    constructor(userModel: Model<User>, mailerService: MailerService);
    isEmailExist: (email: string) => Promise<boolean>;
    _sendMail(email: string, name: string, uuid: string): Promise<void>;
    create(createUserDto: CreateUserDto): Promise<{
        _id: any;
    }>;
    validateCurrentAndPageSize: (current: number, pageSize: number) => void;
    findAll(query: string, current: number, pageSize: number): Promise<{
        userList: (mongoose.Document<unknown, {}, User, {}, {}> & User & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        })[];
        totalPage: number;
    }>;
    findOne(id: number): string;
    findUserByEmail(email: string): Promise<(mongoose.Document<unknown, {}, User, {}, {}> & User & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    update(updateUserDto: UpdateUserDto): Promise<mongoose.UpdateWriteOpResult>;
    remove(_id: string): Promise<mongoose.mongo.DeleteResult>;
    registerAccount(registerDto: RegisterAuthDto): Promise<{
        _id: mongoose.Types.ObjectId;
        codeExpired: Date;
    }>;
    handleVerify(req: VerifyAuthDto): Promise<void>;
    handleGetCodeExpired(_id: string): Promise<{
        codeExpired: Date | undefined;
    }>;
    handleRetryVerify(email: string): Promise<{
        _id: mongoose.Types.ObjectId;
    }>;
}
