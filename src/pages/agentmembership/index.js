// ** MUI Imports
import Grid from '@mui/material/Grid'
import { apiUrls } from 'src/configs/apiurls';
import { Alert } from '@mui/material';

// ** Demo Components Imports
import { useEffect } from 'react';
import { useState } from 'react';
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import { useSession } from 'next-auth/react';
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import { addCommas, digitsEnToFa } from '@persian-tools/persian-tools';
import { isEmail } from 'validator';

const index = () => {

  // const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const [profileSelector, setProfileSelector] = useState({
    isLoggedIn: false
  });
  const [memberShip, setMemberShip] = useState({
    email: "",
    amount: 0,
    isAccecpted: false,
    cash: 0
  });

  const [error, setError] = useState({
    isValid: true,
    errorMessage: ""
  });

  const [errorResult, setErrorResult] = useState({
    isValid: true,
    errorMessage: ""
  });

  useEffect(async () => {

    if (status === "authenticated") {
      setProfileSelector({
        email: session.user.email,
        isLoggedIn: true
      });

      var wallet = await axios.get(apiUrls.WalletUrls.GetUserWalletUsersApi + session.user.email);
      setMemberShip({
        ...memberShip,
        cash: wallet.data.name.cashAmount
      })
    }
  }, [status])

  const transfertHandler = async (e) => {
    e.preventDefault();
    setError({
      isValid: true,
      errorMessage: ""
    });
    if (memberShip.isAccecpted == false || !isEmail(memberShip.email) || memberShip.amount == 0) {
      setError({
        isValid: false,
        errorMessage: "اطلاعات به درستی وارد نشده است."
      });
      return;
    }
    if (memberShip.email == profileSelector.email) {
      setError({
        isValid: false,
        errorMessage: "نمی توانید به ایمیل شخصی خودتان پول واریز کنید"
      });
      return;
    }

    if (parseInt(memberShip.amount) > parseInt(memberShip.cash)) {
      setError({
        isValid: false,
        errorMessage: "مبلغ انتقالی نباید از موجودی حساب شما بیشتر باشد."
      });
      return;
    }


    var obj = memberShip;
    var result = await axios.post(apiUrls.WalletUrls.TransferMoneyToOther, obj);
    if(result.data.name.isValid==false){
      setErrorResult({
        isValid:false,
        errorMessage:result.data.name.message
      });
    }
    console.log({ result });
  }

  const acceptAgreementHandler = (e) => {
    e.preventDefault();
    setError({
      isValid: true,
      errorMessage: ""
    })
    setMemberShip({
      ...memberShip,
      isAccecpted: !memberShip.isAccecpted,
    })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='وارد کردن اطلاعات نماینده فروش' titleTypographyProps={{ variant: 'h6' }} />

          <Divider sx={{ margin: 0 }} />
          <form onSubmit={e => e.preventDefault()}>
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6} >
                  <TextField name="email"
                    type='email'
                    value={memberShip.email}
                    onChange={(e) => setMemberShip({ ...memberShip, email: e.target.value })}
                    fullWidth label='ایمیل' placeholder='وارد کردن ایمیل اجباری است' />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField name="money"
                    type='number'
                    onChange={(e) => setMemberShip({ ...memberShip, amount: parseInt(e.target.value) })}
                    fullWidth label="مبلغ انتقالی" placeholder="مبلغ به تومان" />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Alert severity="info">موجودی حساب شما در حال حاضر : {addCommas(digitsEnToFa(memberShip.cash))} تومان</Alert>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Alert severity="info">مبلغ انتقالی : {addCommas(digitsEnToFa(memberShip.amount))} تومان</Alert>
                </Grid>
              </Grid>

            </CardContent>

            <Divider sx={{ margin: 0 }} />
            <CardActions>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Alert severity="warning">در صورتی که اعتبار به اکانت کاربر دیگیری منتقل شود قابل بازگشت نخواهد بود.</Alert>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={memberShip.isAccecpted}
                      onChange={acceptAgreementHandler} />} label="از انتقال وجه به اکانت دیگر اطمینان دارم." />
                  </FormGroup>
                </Grid>
                <Grid item xs={12}  >
                  {
                    error.isValid == false &&
                    <Alert severity="error">{error.errorMessage}</Alert>
                  }
                  <Button onClick={transfertHandler} disabled={!memberShip.isAccecpted} size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                    انتقال مبلغ به نماینده فروش شما
                  </Button>
                  {
                    errorResult.isValid == false &&
                    <Alert severity="error">{errorResult.errorMessage}</Alert>
                  }
                </Grid>
              </Grid>
            </CardActions>
          </form>
        </Card>

      </Grid>
    </Grid>
  )
}

export default index
