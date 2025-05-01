import {
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  readonly artists;

  @IsISO8601()
  @IsNotEmpty()
  readonly releaseDate: string;

  @IsISO8601()
  @IsNotEmpty()
  readonly duration: string;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
