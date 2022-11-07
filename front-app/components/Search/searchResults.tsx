import axios from "axios";
import qs from "qs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Pagination from "@mui/material/Pagination";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { profileResult, setProfiles } from "../../store/slices/profileSclice";
import { setUpdateProfile } from "../../store/slices/registSlice";
import { selectSearch, setPageInfo } from "../../store/slices/searchSlice";
import {
  selectPrefecturesById,
  selectedHobbiesById,
} from "../../store/slices/masterDataSlice";
import {
  createGenderStr,
  createPrefStr,
  createDisplayHobbies,
} from "../../utils/createStr";
import { Profile, Result } from "../../models/profileModel";
import SnackBar from "../UI/snackBar";
import BackDrop from "../UI/backdrop";
import CustomDialog from "../UI/customDialog";
import classes from "./searchResult.module.css";

const SearchResults = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { searchName, searchPref, searchHobbies, page, totalPage } =
    useAppSelector(selectSearch);
  const [deleteUser, setDeleteUser] = useState({ userId: "", userName: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getProfiles = async () => {
      try {
        const { data } = await axios.get<Result>(
          `${process.env.NEXT_PUBLIC_BACK_END_URL}/profile/`,
          {
            params: {
              page: page,
            },
          }
        );
        dispatch(setProfiles(data.profiles));
        dispatch(setPageInfo({ page: page, totalPage: data.totalPage }));
      } catch (e) {
        console.error(e);
        setErrorMessage("データ取得に失敗しました");
        setFailed(true);
      }
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

      const initPage = 1;
      const { data } = await axios.get<Result>(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/profile/search`,
        {
          params: {
            name: searchName,
            prefID: searchPref,
            hobbies: searchHobbies,
            page: initPage,
          },
          paramsSerializer: {
            serialize: (params) => {
              return qs.stringify(params, { arrayFormat: "comma" });
            },
          },
        }
      );
      dispatch(setProfiles(data.profiles));
      dispatch(setPageInfo({ page: initPage, totalPage: data.totalPage }));
      setProgress(false);
    } catch (e) {
      confirmClose();
      setErrorMessage("データ削除に失敗しました");
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

  const clickPage = async (_: any, page: any) => {
    setProgress(true);
    try {
      const { data } = await axios.get<Result>(
        `${process.env.NEXT_PUBLIC_BACK_END_URL}/profile/search`,
        {
          params: {
            name: searchName,
            prefID: searchPref,
            hobbies: searchHobbies,
            page: page,
          },
          paramsSerializer: {
            serialize: (params) => {
              return qs.stringify(params, { arrayFormat: "comma" });
            },
          },
        }
      );
      dispatch(setProfiles(data.profiles));
      dispatch(setPageInfo({ page: page, totalPage: data.totalPage }));
      setProgress(false);
    } catch (e) {
      console.log(e);
      setProgress(false);
    }
  };

  return (
    <>
      <Grid xs={11}>
        <Table className={classes.tableWidth}>
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
            {profiles.map((profile) => {
              return (
                <TableRow key={profile.userId}>
                  <TableCell>{profile.name}</TableCell>
                  <TableCell>{profile.age}</TableCell>
                  <TableCell>{profile.selfDescription}</TableCell>
                  <TableCell>{createGenderStr(profile.gender)}</TableCell>
                  <TableCell>
                    {profile.hobbies.length > 0
                      ? createDisplayHobbies(profile.hobbies, hobbiesById)
                      : ""}
                  </TableCell>
                  <TableCell>
                    {createPrefStr(profile.prefecture, prefecturesById)}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <DeleteIcon
                        className={classes.actionIcon}
                        onClick={() =>
                          deleteConfim(profile.userId, profile.name)
                        }
                      />
                      <EditIcon
                        className={classes.actionIcon}
                        onClick={() => updateHandler(profile.userId)}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          style={{ marginTop: "15px" }}
        >
          <Pagination
            count={totalPage}
            page={page}
            color="primary"
            onChange={clickPage}
          />
        </Grid>
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
        message={errorMessage}
      />
    </>
  );
};
export default SearchResults;
