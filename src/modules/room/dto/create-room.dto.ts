import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(32)
    description: string;
      
    @IsBoolean()
    isPublic: boolean;
}
