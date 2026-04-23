import { IsIn, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateFileDto {
  
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    name: string;
    
    @IsString()
    @IsNotEmpty()
    @IsIn(['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust'])
    language: string;
    
    @IsString()
    @IsNotEmpty()
    content: string;

}
