import { PROFILE_SUCCESS } from "../actions/profileActions"

const initialState = {
    ProfileData: {
      email:"",
      isLoggedIn:false,
      isagent:false
    }
  }
  
  export default function ProfileReducer(state = initialState, action) {

    switch (action.type) {
  
      
      case PROFILE_SUCCESS:
        
        return {
          ProfileData: action.payload,
  
        }
  
      default:
        return state
    }
  }