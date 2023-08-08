export const PROFILE_SUCCESS = "PROFILE_SUCCESS";

export default function Profilestatus(ProfileData) {

  return dispatch => {
    dispatch({
      type: PROFILE_SUCCESS,
      payload: ProfileData
    });
  }
}