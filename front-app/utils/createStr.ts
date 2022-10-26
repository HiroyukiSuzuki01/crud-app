import { MasterById } from "../models/masterDataModel";

const HOKKAIDO_ID = "1";
const TOKYO_ID = "13";
const KYOTO_ID = "26";
const OOSAKA_ID = "27";

export const createGenderStr = (gender: string) => {
  return gender === "1" ? "男性" : "女性";
};

export const createPrefStr = (
  prefecture: string,
  prefecturesById: MasterById
) => {
  let prefSuffix = "県";
  switch (prefecture) {
    case HOKKAIDO_ID:
      prefSuffix = "";
      break;
    case TOKYO_ID:
      prefSuffix = "都";
      break;
    case KYOTO_ID:
    case OOSAKA_ID:
      prefSuffix = "府";
      break;
  }
  return `${prefecturesById[prefecture].Name}${prefSuffix}`;
};

export const createDisplayHobbies = (
  hobbies: string[],
  hobbiesById: MasterById
) => {
  const hobbyConv = hobbies.map((hobby) => hobbiesById[hobby].Name).join("　");

  return hobbyConv;
};
