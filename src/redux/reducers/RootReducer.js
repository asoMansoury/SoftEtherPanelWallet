import { combineReducers } from "redux";
import ProfileReducer from "./ProfileReducer";

const RootReducer = combineReducers({
  Profile: ProfileReducer
});

export default RootReducer;