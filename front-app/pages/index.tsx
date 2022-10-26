import axios from "axios";
import { useEffect } from "react";

import SearchItems from "../components/Search/searchItems";
import SearchResults from "../components/Search/searchResults";
import { useAppDispatch } from "../store/hooks";
import { setPrefectures, setHobbies } from "../store/slices/masterDataSlice";
import { MasterDataProps } from "../models/masterDataModel";

const Search = (props: MasterDataProps) => {
  const { allPrefectures, allHobbies } = props;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPrefectures(allPrefectures));
    dispatch(setHobbies(allHobbies));
  }, []);

  return (
    <>
      <SearchItems />
      <SearchResults />
    </>
  );
};

export async function getStaticProps() {
  const { data } = await axios.get<MasterDataProps>(
    "http://backend-app:8080/masterData"
  );

  return {
    props: {
      allPrefectures: data.allPrefectures,
      allHobbies: data.allHobbies,
    },
  };
}

export default Search;
