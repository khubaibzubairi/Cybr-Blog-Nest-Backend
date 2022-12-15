import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/schema/user.schema';

export class AdminDto {
  _id: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  confirmpassword: string;

  @ApiProperty()
  image!: string;

  @ApiProperty({ default: Role.ADMIN })
  role!: Role[];

  @ApiProperty()
  refreshToken: string;
}
