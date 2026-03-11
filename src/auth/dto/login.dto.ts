import { IsNotEmpty } from 'class-validator';

// 登录DTO
export class LoginDto {
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

// 更新密码DTO
export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'Old password is required' })
  oldPassword: string;

  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;
}
