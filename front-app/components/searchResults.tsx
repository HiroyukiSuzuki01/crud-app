import axios from "axios";
import { useEffect, useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Button from "@mui/material/Button";
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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { profileResult, setProfiles } from "../store/slices/profileSclice";
import { genderDisplay, prefectureSuffix } from "../utils/createStr";

const SearchResults = () => {
  const dispatch = useAppDispatch();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteUser, setDeleteUser] = useState({ userId: "", userName: "" });

  useEffect(() => {
    const getProfiles = async () => {
      const url = "http://localhost:8080/profile/";
      const { data } = await axios.get(url);
      dispatch(setProfiles(data));
    };
    getProfiles();
  }, []);
  const profiles = useAppSelector(profileResult);

  const deleteConfim = (userId: string, userName: string) => {
    setDeleteUser({ ...deleteUser, userId, userName });
    confirmOpen();
  };

  const deleteHandler = async () => {
    const url = "http://localhost:8080/profile/delete";
    const data = {
      userId: deleteUser.userId,
    };
    try {
      const res = await axios.delete(url, { data });
      console.log(res);
    } catch (e) {
      console.log(e);
      confirmClose();
    }
  };

  const confirmOpen = () => {
    setDeleteConfirm(true);
  };

  const confirmClose = () => {
    setDeleteUser({ ...deleteUser, userId: "", userName: "" });
    setDeleteConfirm(false);
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
      <TableContainer component={Paper}>
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
                <TableCell component="th" scope="row">
                  {profile.name}
                </TableCell>
                <TableCell component="th" align="right">
                  {profile.age}
                </TableCell>
                <TableCell component="th" align="right">
                  {profile.selfDescription}
                </TableCell>
                <TableCell component="th" align="right">
                  {genderDisplay(profile.gender)}
                </TableCell>
                <TableCell component="th" align="right">
                  {profile.userId}
                </TableCell>
                <TableCell component="th" align="right">
                  {prefectureSuffix(profile.prefecture)}
                </TableCell>
                <TableCell component="th" align="right">
                  <DeleteIcon
                    onClick={() => deleteConfim(profile.userId, profile.name)}
                  />
                </TableCell>
                <TableCell component="th" align="right">
                  <EditIcon />
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
      </TableContainer>

      <Dialog
        open={deleteConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">削除確認</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`${deleteUser.userName}さんを削除します。よろしいですか?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmClose}>キャンセル</Button>
          <Button onClick={deleteHandler} autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default SearchResults;