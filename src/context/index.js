import { createContext,useContext, useReducer } from "react";
import { authContstants } from "./contstants";

const Store = createContext();

const reducer = (state , action) =>{
    switch(action.type){
        case authContstants.LOGIN_REQUEST:{
            return {
                ...state,
                user:{
                    authenticating:true,
                    ...state.user
                }
            }
        }
        case authContstants.LOGIN_SUCCESS:{
            return {
                ...state,
                user:{
                    ...action.payload,
                    authenticating:false,
                    authenticated:true
                }
            }
        }
        case authContstants.LOGIN_FAILURE:{
            return {
                ...state,
                user:{
                    ...state.user,
                    error:action.payload
                }
            }
        }
        default:
            {
                return state;
            }
    }
}
export const useStore =() =>useContext(Store);

export const StoreProvider = ({children})=>{
    const [state, dispatch] = useReducer(reducer,{
        name:{
            authenticated:false,
            authenticating:false,
            error:null
        },

    });
    return (
        <Store.Provider value ={[state,dispatch]}>
            {children}
        </Store.Provider>
    )
}