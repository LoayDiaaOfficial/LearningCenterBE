import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {

    constructor(private readonly jwtService : JwtService){};

    generateToken(user : User){
        const payload = { sub: user.id, role: user.userType.type};
        return this.jwtService.sign(payload);
    }

    hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }


}
