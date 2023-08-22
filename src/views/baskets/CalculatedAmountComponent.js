import {useState,useEffect} from 'react';
import {Alert} from '@mui/material/'
import { addCommas, digitsEnToFa } from '@persian-tools/persian-tools';

export const CalculatedAmountComponent = (props) =>{
    const [profileSelector,setProfileSelector ]= useState();
    const [price,setPrice] =  useState(0);
    const [agentprice,setAgentprice] =  useState(0);

    useEffect(()=>{
        setPrice(props.price);
        setAgentprice(props.agentprice);
    },[props]);

    useEffect(()=>{
        setProfileSelector(props.profileSelector);
    },[props.profileSelector]);
    return (
        profileSelector!= undefined &&
            profileSelector.isAgent == true ? (<div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', minWidth: '250px', alignItems: 'center' }}>
              <div>
                <Alert severity="success">مبلغ اکانت(محاسبه شده برای شما) : </Alert>
                <Alert severity="error">{addCommas(digitsEnToFa(price.toString()))} تومان</Alert>
              </div>
              <div>
                <Alert severity="success">مبلغ اکانت(مبلغی که مشتریان شما در پنل خود خواهند دید) : </Alert>
                <Alert severity="error">{addCommas(digitsEnToFa(agentprice.toString()))} تومان</Alert>
              </div>
            </div>
            ) : (
              <>
                <Alert severity="success">مبلغ اکانت : </Alert>
                <Alert severity="error">{addCommas(digitsEnToFa(agentprice.toString()))} تومان</Alert>

              </>
            )
          
    )
}


export default CalculatedAmountComponent;