import { Classroom } from "./Classroom.inteface";
import { Parent } from "./Parent.interface";

export interface Student {
    id:           number;
    name:         string;
    lastname:     string;
    country:      string;
    dni:          string;
    classroom:    Classroom;
    birthdate:    Date;
    alimentation: string;
    comments:     string;
    familyUnit:   string;
    parents:      Parent[];
    hash:         string;
    //TODO revisaer el tipo ANY
    documents:    any;
}