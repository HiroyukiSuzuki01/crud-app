export interface InitProfile {
  name: string;
  age: string;
  selfDescription: string;
  gender: string;
  hobbies: string[];
  prefecture: string;
  address: string;
}

export interface Profile extends InitProfile {
  userId: string;
}

export interface Result {
  profiles: Profile[];
  count: number;
}
