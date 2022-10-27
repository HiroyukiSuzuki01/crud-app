import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { profileResult, setProfiles } from "../../store/slices/profileSclice";
import { setUpdateProfile } from "../../store/slices/registSlice";
import { selectSearch } from "../../store/slices/searchSlice";
import {
  selectPrefecturesById,
  selectedHobbiesById,
} from "../../store/slices/masterDataSlice";
import {
  createGenderStr,
  createPrefStr,
  createDisplayHobbies,
} from "../../utils/createStr";
import { Profile } from "../../models/profileModel";
import SnackBar from "../UI/snackBar";
import BackDrop from "../UI/backdrop";
import CustomDialog from "../UI/customDialog";
import classes from "./searchResult.module.css";

const SearchResults = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { searchName, searchPref, searchHobbies } =
    useAppSelector(selectSearch);
  const [deleteUser, setDeleteUser] = useState({ userId: "", userName: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    const getProfiles = async () => {
      const url = "http://localhost:8080/profile/";
      const { data } = await axios.get(url);
      dispatch(setProfiles(data));
    };
    getProfiles();
  }, []);
  const profiles = useAppSelector(profileResult);
  const prefecturesById = useAppSelector(selectPrefecturesById);
  const hobbiesById = useAppSelector(selectedHobbiesById);

  const deleteConfim = (userId: string, userName: string) => {
    setDeleteUser({ ...deleteUser, userId, userName });
    confirmOpen();
  };

  const closeSnackBar = () => {
    setFailed(false);
  };

  const deleteHandler = async () => {
    const deleteData = {
      userId: deleteUser.userId,
    };
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/profile/delete`,
        { data: deleteData }
      );
      confirmClose();
      setProgress(true);

      const { data } = await axios.get<Profile[]>(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/profile/search`,
        {
          params: {
            name: searchName,
            prefID: searchPref,
            hobbies: searchHobbies,
          },
        }
      );
      dispatch(setProfiles(data));
      setProgress(false);
    } catch (e) {
      confirmClose();
      setFailed(true);
    }
  };

  const confirmOpen = () => {
    setDeleteConfirm(true);
  };

  const confirmClose = () => {
    setDeleteUser({ ...deleteUser, userId: "", userName: "" });
    setDeleteConfirm(false);
  };

  const updateHandler = (userId: string) => {
    const updateUser = profiles.find(
      (profile) => profile.userId === userId
    ) as Profile;
    dispatch(setUpdateProfile(updateUser));
    router.push("/register");
  };

  // check
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  function createData(name: string, calories: number, fat: number) {
    return { name, calories, fat };
  }

  const rows = [
    createData("Cupcake", 305, 3.7),
    createData("Donut", 452, 25.0),
    createData("Eclair", 262, 16.0),
    createData("Frozen yoghurt", 159, 6.0),
    createData("Gingerbread", 356, 16.0),
    createData("Honeycomb", 408, 3.2),
    createData("Ice cream sandwich", 237, 9.0),
    createData("Jelly Bean", 375, 0.0),
    createData("KitKat", 518, 26.0),
    createData("Lollipop", 392, 0.2),
    createData("Marshmallow", 318, 0),
    createData("Nougat", 360, 19.0),
    createData("Oreo", 437, 18.0),
  ];
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      <Grid xs={11}>
        <Table aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>名前</TableCell>
              <TableCell>年齢</TableCell>
              <TableCell>自己紹介</TableCell>
              <TableCell>性別</TableCell>
              <TableCell>趣味</TableCell>
              <TableCell>住所</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? // ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                profiles
              : profiles
            ).map((profile) => (
              <TableRow key={profile.name}>
                <TableCell>{profile.name}</TableCell>
                <TableCell>{profile.age}</TableCell>
                <TableCell>{profile.selfDescription}</TableCell>
                <TableCell>{createGenderStr(profile.gender)}</TableCell>
                <TableCell>
                  {createDisplayHobbies(profile.hobbies, hobbiesById)}
                </TableCell>
                <TableCell>
                  {createPrefStr(profile.prefecture, prefecturesById)}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <DeleteIcon
                      className={classes.actionIcon}
                      onClick={() => deleteConfim(profile.userId, profile.name)}
                    />
                    <EditIcon
                      className={classes.actionIcon}
                      onClick={() => updateHandler(profile.userId)}
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              {/* <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={profiles.length}
                rowsPerPage={10}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
              /> */}
            </TableRow>
          </TableFooter>
        </Table>
      </Grid>

      <CustomDialog
        open={deleteConfirm}
        title="削除確認"
        message={`${deleteUser.userName}さんを削除します。よろしいですか?`}
        cancel={confirmClose}
        exec={deleteHandler}
        action="削除"
      />

      <BackDrop progress={progress} />
      <SnackBar
        open={failed}
        close={closeSnackBar}
        duration={6000}
        message="削除に失敗しました"
      />
    </>
  );
};
export default SearchResults;
