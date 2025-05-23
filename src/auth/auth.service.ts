import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from './dto/logIn.dto';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from '../artists/artists.service';
import { Enable2FAType, PayloadType } from './dto/types';
import * as speakeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';
import { User } from '../users/users.entity';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService, // auth
    private artistService: ArtistsService,
    private configService: ConfigService,
  ) {}

  async login(
    loginDTO: LoginDTO,
  ): Promise<
    | { accessToken: string }
    | { tempToken: string; validate2FA: string; message: string }
  > {
    console.log('Incoming login DTO:', loginDTO);

    const user = await this.userService.findOne(loginDTO);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );
    console.log('Password matched:', passwordMatched);

    if (!passwordMatched) {
      throw new UnauthorizedException('Password does not match');
    }

    delete user.password;
    const payload: PayloadType = {
      email: user.email,
      userId: user.id,
      // artistId: user.artistId,
    };

    // Handle 2FA
    if (user.enable2FA && user.twoFASecret) {
      const tempToken = this.jwtService.sign(payload, { expiresIn: '5m' });
      return {
        tempToken,
        validate2FA: 'http://localhost:3000/auth/validate-2fa',
        message:
          'Please send the one-time password/token from your Google Authenticator App',
      };
    }

    // Return access token
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  //Two factor authentication function (enable 2fa token) - creates a secret key(Token) for the user and saved in db
  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.userService.findById(userId);
    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }
    const secret = speakeasy.generateSecret();
    console.log(secret);
    user.twoFASecret = secret.base32;
    await this.userService.updateSecretKey(user.id, user.twoFASecret);
    return { secret: user.twoFASecret };
  }

  // validate the 2fa secret with provided token (validate 2fa token) - Verify One-time password/token
  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      // find the user on the based on id
      const user = await this.userService.findById(userId);
      // extract his 2FA secret
      // verify the secret with a token by calling the speakeasy verify method
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });
      // if validated then sends the json web token in the response
      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch (err) {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  // Disable the 2fa secret
  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    return this.userService.findByApiKey(apiKey);
  }

  getEnvVariables() {
    return {
      port: this.configService.get<number>('port'),
    };
  }
}
