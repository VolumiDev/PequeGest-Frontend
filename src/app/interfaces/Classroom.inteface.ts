import { Activity } from "./Activity.inteface";
import { Course } from "./Course.interface";

export interface Classroom {
    id:            number;
    classroomName: string;
    hash:          string;
    course:        Course;
    activities:    Activity[];
}