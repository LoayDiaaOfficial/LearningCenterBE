import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';



@Injectable()
export class AuthService {

    constructor(private readonly jwtService : JwtService){};

    generateToken(user : User){
        const payload = { sub: user.id, role: user.userType.id };
        return this.jwtService.sign(payload);
    }

}
