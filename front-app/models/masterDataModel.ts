export interface Master {
  ID: string;
  Name: string;
}

export interface MasterById {
  [ID: string]: Master;
}

export interface MasterDataState {
  prefectures: Master[];
  prefecturesById: MasterById;
  hobbies: Master[];
  hobbiesById: MasterById;
}

export interface MasterDataProps {
  allPrefectures: Master[];
  allHobbies: Master[];
}
