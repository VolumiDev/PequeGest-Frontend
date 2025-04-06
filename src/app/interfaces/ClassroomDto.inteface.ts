import { ActivitiesDto } from './ActivityDto.inteface';
import { CourseDto } from './CourseDto.interface';

export interface ClassroomDto {
  id: number;
  classroomName: string;
  hash: string;
  courseDto: CourseDto;
  activitiesDto: ActivitiesDto[];
}
