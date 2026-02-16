// Basic types based on legacy JS
export interface GeoLocation {
  Name: string;
  Longitude: number;
  Latitude: number;
}

export interface Time {
  StdTime: string;
  Location: GeoLocation;
}

export interface LifeEvent {
  PersonId: string;
  Id: string;
  Name: string;
  StartTime: Time;
  Description: string;
  Nature: string;
  Weight: string;
}

export interface Person {
  PersonId: string;
  Name: string;
  Notes: string;
  BirthTime: string;
  Gender: string;
  OwnerId: string;
  BirthLocation: string;
  Latitude: number;
  Longitude: number;
  TimezoneOffset: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export type Gender = "Male" | "Female";
export interface TimeSlice {
  personId?: string;
  id?: string;
  StartTime: string;
  EndTime: string;
  Value: number;
  Color: string;
  EventName?: string;
  EventDescription?: string;
  NatureScore?: number;
}
