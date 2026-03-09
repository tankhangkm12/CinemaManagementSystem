import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
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
    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
    phone !: string;
}