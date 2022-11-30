import { ApiProperty } from '@nestjs/swagger';

export class RefTokenDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  refreshToken: string;
}
