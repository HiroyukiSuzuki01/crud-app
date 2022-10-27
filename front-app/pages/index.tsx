import axios from "axios";
import { useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";

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
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={4}
    >
      <SearchItems />
      <SearchResults />
    </Grid>
  );
};

export async function getStaticProps() {
  const { data } = await axios.get<MasterDataProps>(
    `${process.env.REACT_APP_BACK_END_SERVER_SIDE_URL}/masterData`
  );

  return {
    props: {
      allPrefectures: data.allPrefectures,
      allHobbies: data.allHobbies,
    },
  };
}

export default Search;
