export const genderDisplay = (gender: string) => {
  return gender === "1" ? "男性" : "女性";
};

const HOKKAIDO_ID = "1";
const TOKYO_ID = "13";
const PREF_ARR = ["26", "27"];

export const prefectureSuffix = (prefecture: string) => {
  if (prefecture === HOKKAIDO_ID) return "";
  if (prefecture === TOKYO_ID) return "都";
  if (PREF_ARR.includes(prefecture)) return "府";

  return "県";
};
