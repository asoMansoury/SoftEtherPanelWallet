
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { Alert } from '@mui/material';
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import React from "react";
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { addCommas, digitsEnToFa } from '@persian-tools/persian-tools';
import { apiUrls } from 'src/configs/apiurls';
import { CopyToClipboard } from "react-copy-to-clipboard";
export const index = () => {
    const { data: session, status } = useSession();
    const [profileSelector, setProfileSelector] = useState({
        isLoggedIn: false
    });
    const [disabledBtn, setDisabledBtn] = useState(true);
    const [disabledTelegramBtn, setDisabledTelegramBtn] = useState(false);
    const [password, setPassword] = useState("");
    const [telegram, setTelegram] = useState("");
    const [ciscoUrl, setCiscoUrl] = useState("");
    const [openVpn, setOpenVpn] = useState("");
    const [vpnhood, setVpnhood] = useState("");
    const [softEtherVpn, setEtherOpnVpn] = useState("");
    const [validChange, setValidChange] = useState({
        isValid: true,
        errorMsg: ""
    });
    useEffect(() => {
        if (status == 'authenticated') {
            setProfileSelector({
                email: session.user.email,
                cashAmount: session.user.cashAmount,
                isLoggedIn: true
            });

            setVpnhood(apiUrls.domains.DomainUrl + "/testaccounts/vpnhood/" + session.user.agentcode);
            setCiscoUrl(apiUrls.domains.DomainUrl + "/testaccounts/" + session.user.agentcode);
            setOpenVpn(apiUrls.domains.DomainUrl + "/testaccounts/OpenTunnel/" + session.user.agentcode);
            setEtherOpnVpn(apiUrls.domains.DomainUrl + "/testaccounts/iran/" + session.user.agentcode);
        } else if (status == 'unauthenticated') {

        }
    }, [status]);

    function passwordTxtHandler(e) {
        setPassword(e.target.value);
        setValidChange({
            ...validChange,
            isValid: true
        })
        if (e.target.value.length <= 4) {
            setDisabledBtn(true);
            return;
        }
        setDisabledBtn(false);

    }
    async function btnChangeHandler(e) {
        e.preventDefault();
        var body = { password: password };
        var result = await axios.post(apiUrls.userUrl.ChangeUserPassworUrl, body);
        if (result.data.result.isValid == true) {
            setValidChange({
                isValid: false,
                errorMsg: "عملیات با موفقیت انجام گردید."
            })
        } else {
            setValidChange({
                isValid: false,
                errorMsg: result.data.errorMsg

            })
        }

        setPassword('');
        setDisabledBtn(true);
    }


    async function btnChangeTelegramHandler(e) {
        e.preventDefault();
        setDisabledTelegramBtn(true);
        var result = await axios.get(apiUrls.agentUrl.ChangeTelegramUrl + telegram);
        console.log({ result });
        if (result.data.name.isValid == true) {
            setValidChange({
                isValid: false,
                errorMsg: "عملیات با موفقیت انجام گردید."
            })
        } else {
            setValidChange({
                isValid: false,
                errorMsg: result.data.errorMsg

            })
        }

        setDisabledTelegramBtn(false);
    }
    return <div>
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='اطلاعات پروفایل شما' titleTypographyProps={{ variant: 'h6' }} />
                    <Divider sx={{ margin: 0 }} />
                    <CardContent>
                        {
                            profileSelector.isLoggedIn == true && <>
                                <Grid container spacing={6}>
                                    <Grid item xs={12}>
                                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                            ایمیل
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label='ایمیل' placeholder='carterLeonard' value={profileSelector.email} disabled={true} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Alert severity='info'>موجودی حساب شما در حال حاضر : {addCommas(digitsEnToFa(profileSelector.cashAmount))} تومان می باشد</Alert>
                                    </Grid>
                                    <Divider></Divider>
                                    <Grid item xs={12} sm={12}>
                                        <CopyToClipboard
                                            text={vpnhood}
                                            onCopy={() => alert("کپی شد")}>
                                            <Alert severity='info'>برای کپی کردن آدرس اختصاصی وی پی ان هود اینجا کلیک کنید.</Alert>
                                        </CopyToClipboard>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <CopyToClipboard
                                            text={ciscoUrl}
                                            onCopy={() => alert("کپی شد")}>
                                            <Alert severity='info'>برای کپی کردن آدرس اختصاصی سیسکو اینجا کلیک کنید.</Alert>
                                        </CopyToClipboard>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <CopyToClipboard
                                            text={openVpn}
                                            onCopy={() => alert("کپی شد")}>
                                            <Alert severity='info'>برای کپی کردن آدرس اختصاصی OpenVpn اینجا کلیک کنید.</Alert>
                                        </CopyToClipboard>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <CopyToClipboard
                                            text={softEtherVpn}
                                            onCopy={() => alert("کپی شد")}>
                                            <Alert severity='info'>برای کپی کردن آدرس اختصاصی وی پی ان ایران اینجا کلیک کنید.</Alert>
                                        </CopyToClipboard>
                                    </Grid>

                                    <Divider></Divider>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label=' وارد کردن آدرس کانال تلگرام' placeholder='carterLeonard' onChange={(e) => setTelegram(e.target.value)} value={telegram} />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Button fullWidth label='تغییر آدرس تلگرام' type='submit' variant='آدرس تلگرام' disabled={disabledTelegramBtn} onClick={btnChangeTelegramHandler}>تغییر آدرس تلگرام</Button>
                                    </Grid>

                                    <Divider></Divider>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label='پسورد' placeholder='carterLeonard' onChange={passwordTxtHandler} value={password} />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Button fullWidth label='تغییر پسورد' type='submit' variant='تغییر پسورد' disabled={disabledBtn} onClick={btnChangeHandler}>تغییر پسورد</Button>
                                    </Grid>
                                    {
                                        !validChange.isValid &&
                                        <Grid item xs={12} >
                                            <Alert severity='success'>{validChange.errorMsg}</Alert>
                                        </Grid>
                                    }

                                </Grid>
                            </>
                        }

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </div>
}

export default index;