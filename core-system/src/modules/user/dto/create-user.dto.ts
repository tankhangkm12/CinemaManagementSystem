import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, MinLength, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'Tên phải là một chuỗi ký tự' })
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name !: string;

    @IsEmail({}, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email !: string;

    @IsString()
    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password !: string;

    @IsString()
    @IsNotEmpty({ message: 'Role ID không được để trống' })
    role_id !: string;

    @IsString()
    @IsOptional() // Vì mặc định là null trong schema
    tenant_id?: string;

    @IsString()
    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
    phone !: string;
}