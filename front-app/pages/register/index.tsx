import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setName,
  setAge,
  setGender,
  setSelfDescription,
  setHobby,
  setPrefecture,
  setAddress,
  selectRegist,
  reset,
} from "../../store/slices/registSlice";

const Register = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name, age, gender, selfDescription, hobby, prefecture, address } =
    useAppSelector(selectRegist);

  // DBから取得予定
  const prefectures = [
    { id: "1", name: "北海道" },
    { id: "47", name: "沖縄" },
  ];

  const prefecturesSelect = [{ id: "-1", name: "未設定" }, ...prefectures];

  const prefecturesOption = prefecturesSelect.map((prefecture) => (
    <option value={prefecture.id} key={prefecture.id}>
      {prefecture.name}
    </option>
  ));

  const submitHandler = (event: any) => {
    event.preventDefault();
    router.replace("/register/confirm");
  };

  return (
    <>
      <form>
        <table>
          <tbody>
            <tr>
              <td>名前</td>
              <td>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => dispatch(setName(event.target.value))}
                />
              </td>
            </tr>
            <tr>
              <td>年齢</td>
              <td>
                <input
                  type="text"
                  value={age}
                  onChange={(event) => dispatch(setAge(event.target.value))}
                />
              </td>
            </tr>
            <tr>
              <td>性別</td>
              <td>
                <label>
                  <input
                    type="radio"
                    value="1"
                    checked={gender === "1"}
                    onChange={(event) =>
                      dispatch(setGender(event.target.value))
                    }
                  />
                  男性
                </label>
                <label>
                  <input
                    type="radio"
                    value="2"
                    checked={gender === "2"}
                    onChange={(event) =>
                      dispatch(setGender(event.target.value))
                    }
                  />
                  女性
                </label>
              </td>
            </tr>
            <tr>
              <td>住所</td>
              <td>
                <select
                  value={prefecture}
                  onChange={(event) =>
                    dispatch(setPrefecture(event.target.value))
                  }
                >
                  {prefecturesOption}
                </select>
                <input
                  type="text"
                  value={address}
                  onChange={(event) => dispatch(setAddress(event.target.value))}
                />
              </td>
            </tr>
            <tr>
              <td>趣味</td>
              <td>
                <label>
                  <input
                    type="checkbox"
                    value="1"
                    onChange={(event) => dispatch(setHobby(event.target.value))}
                  />
                  映画鑑賞
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="2"
                    onChange={(event) => dispatch(setHobby(event.target.value))}
                  />
                  読書
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="3"
                    onChange={(event) => dispatch(setHobby(event.target.value))}
                  />
                  買い物
                </label>
              </td>
            </tr>
            <tr>
              <td>自己紹介</td>
              <td>
                <textarea
                  value={selfDescription}
                  onChange={(event) =>
                    dispatch(setSelfDescription(event.target.value))
                  }
                />
              </td>
            </tr>
            <tr>
              <td>写真</td>
              <td>test</td>
            </tr>
          </tbody>
        </table>
        <button type="submit" onClick={submitHandler}>
          送る
        </button>
        <button type="button" onClick={() => dispatch(reset())}>
          リセット
        </button>
      </form>
    </>
  );
};

export default Register;
