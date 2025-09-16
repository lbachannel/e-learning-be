import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
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
    verify(verifyDto: VerifyAuthDto): Promise<void>;
    retryVerify(email: string): Promise<{
        _id: import("mongoose").Types.ObjectId;
    }>;
    getCodeExpired(_id: string): Promise<{
        codeExpired: Date | undefined;
    }>;
}
