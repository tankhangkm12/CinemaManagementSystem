import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoggerService } from 'src/common/logger/logger.service';
import { KeyService } from './key.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { compare } from 'src/common/utils';
import { RoleService } from '../role/role.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(LoggerService) private readonly logger: LoggerService,
    @Inject(KeyService) private readonly keyService: KeyService,
    @Inject(RoleService) private readonly roleService: RoleService,
  ) {}

  private async issueToken(userId: string) {
    const { key, kid } = await this.keyService.getAccessSigningKey();

    const token = await this.jwtService.signAsync(
      { id: userId },
      {
        secret: key,
        expiresIn: '5m',
        header: { alg: 'HS256', kid },
      },
    );

    return { accessToken: token };
  }

  async signUp(registerUserDTO: RegisterUserDto) {
    const createUserDto: CreateUserDto = {
      ...registerUserDTO,
      role_id: undefined,
      role: 'USER',
      tenant: undefined,
    };

    const user = await this.userService.createUser(createUserDto);
    this.logger.log(`User ${user.email} registered`);

    return this.issueToken(user.userId);
  }

  async signIn(loginUserDto: LoginUserDto) {
    const foundUser = await this.userService.getUserForAuth(loginUserDto.email);

    if (!foundUser) throw new BadRequestException('User not found');

    if (foundUser.is_active === false) throw new BadRequestException('User was banned');

    console.log({foundUser})

    const isMatch = await compare(loginUserDto.password, foundUser.password);
    if (!isMatch) throw new BadRequestException('Password not match');

    this.logger.log(`User ${foundUser.email} login`);

    const token = await this.issueToken(foundUser.userId);

    return token;
  }

  async verifyToken(token: string): Promise<any> {
    const decoded = this.jwtService.decode(token, { complete: true }) as any;
    const kid: string | undefined = decoded?.header?.kid;

    if (!kid) throw new UnauthorizedException('Token missing kid');

    const secret = await this.keyService.getAccessKeyByKid(kid);
    if (!secret) throw new UnauthorizedException('Unknown or expired signing key');

    try {
      return await this.jwtService.verifyAsync(token, { secret });
    } catch (e: any) {
      this.logger.debug(`Token verify failed for kid=${kid}: ${e.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // Sliding renewal - gọi từ interceptor khi token còn < 2m
  async renewToken(token: string): Promise<{ accessToken: string } | null> {
    const decoded = this.jwtService.decode(token) as any;
    if (!decoded?.id) return null;

    const now = Math.floor(Date.now() / 1000);
    const timeLeft = decoded.exp - now;

    if (timeLeft > 2 * 60) return null; // còn nhiều hơn 2m → không cần renew

    const newToken = await this.issueToken(decoded.id);

    console.log(newToken)

    return newToken;
  }

  async checkPermission(userId: string, requirePermissions: string[]): Promise<boolean> {
    const user = await this.userService.getUserById(userId);
    if (!user) return false;

    const permissions = await this.roleService.getPermissionsByRoleId(user.role.role_id);

    if (!permissions) return false;

    return requirePermissions.every((p) => permissions.includes(p));
  }
}