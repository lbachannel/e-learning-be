import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        user: {
            _id: any;
            email: any;
            name: any;
        };
        access_token: string;
    }>;
    register(registerDto: RegisterAuthDto): Promise<{
        _id: import("mongoose").Types.ObjectId;
        codeExpired: Date;
    }>;
    verify(data: VerifyAuthDto): Promise<void>;
    getCodeExpired(_id: string): Promise<{
        codeExpired: Date | undefined;
    }>;
    retryVerify(email: string): Promise<{
        _id: import("mongoose").Types.ObjectId;
    }>;
}
