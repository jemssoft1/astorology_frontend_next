// types/person.ts
export type Gender = "Male" | "Female";

export interface BirthTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  timezone: string;
}

export interface AddPersonRequest {
  ownerId: string;
  personName: string;
  birthTime: BirthTime;
  gender: Gender;
  notes?: string;
  failIfDuplicate?: boolean;
}

export interface UpdatePersonRequest {
  ownerId: string;
  personId: string;
  personName?: string;
  birthTime?: BirthTime;
  gender?: Gender;
  notes?: string;
}

export interface Person {
  id: string;
  name: string;
  birthTime: BirthTime;
  gender: Gender;
  notes?: string;
}

export interface ApiResponse<T = any> {
  Status: "Pass" | "Fail";
  Payload: T;
  Duration?: string;
}
