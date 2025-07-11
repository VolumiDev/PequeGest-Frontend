import { ClassroomDto } from './ClassroomDto.inteface';
import { ParentDto } from './ParentDto.interface';

export interface StudentDto {
  name: string;
  lastname: string;
  country: string;
  region: string;
  classroomDto: ClassroomDto;
  birthdate: Date;
  alimentation: string;
  comments: string;
  doubleAuthorization: boolean;
  parentsDto: ParentDto[];
  hash?: string;
  documents?: string;
  imageURL?: string;
}
