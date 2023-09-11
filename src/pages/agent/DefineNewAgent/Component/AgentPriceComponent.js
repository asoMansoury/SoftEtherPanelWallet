// ** MUI Imports
import Grid from '@mui/material/Grid'
import { apiUrls } from 'src/configs/apiurls';
import { Alert } from '@mui/material';
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableContainer from '@mui/material/TableContainer'
// ** Demo Components Imports
import { useEffect } from 'react';
import TextField from '@mui/material/TextField'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { addCommas, digitsEnToFa } from '@persian-tools/persian-tools';
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Button, Input } from '@mui/material';
import { isEmail } from 'validator';

const AgentPriceComponent = (props) => {
    const [agentInformation, setAgentInformation] = useState();
    const [plans, setPlans] = useState([]);
    const [error, setError] = useState({
        isValid: true,
        errosMsg: "",
        severity: "error"
    })

    const [disableBtn, setDisableBtn] = useState(false)

    useEffect(async () => {
        setPlans(props.plans);
    }, [props]);


    function changePrice(e, row) {
        var elementID = e.target['id'];
        const updatedPlans = plans.map((plan) => {
            if (plan.tariffplancode === row.tariffplancode &&
                plan.tarrifcode === row.tarrifcode &&
                plan.type === row.type) {
                return {
                    ...plan,
                    [elementID]: parseInt(e.target.value),
                };
            }
            return plan;
        });

        props.changePriceHandler(updatedPlans);
        setPlans(updatedPlans);

    }

    return <div>
        {
            plans.length > 0 && <>
                <TableContainer sx={{
                    maxHeight: 440, overflowX: 'auto', scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': {
                        width: '10px',
                        height: '10px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '10px',
                    }
                }}>
                    <Table stickyHeader sx={{ minWidth: 650, touchAction: 'manipulation' }} style={{ userSelect: 'none' }} aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>شماره ردیف</TableCell>
                                <TableCell align='center'>نوع اکانت</TableCell>
                                <TableCell align='center'>تعداد کاربر</TableCell>
                                <TableCell align='center'>زمان کاربر</TableCell>
                                <TableCell align='center'>قیمت فروش  به شما(تومان)</TableCell>
                                <TableCell align='center'>قیمت فروش شما به نماینده فروش(تومان)</TableCell>
                                <TableCell align='center'>قیمت فروش نماینده به مشتریانش(تومان)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {plans.map((row, index) => (
                                <TableRow
                                    key={row.name}
                                    sx={{
                                        '&:last-of-type td, &:last-of-type th': {
                                            border: 0
                                        }
                                    }}
                                >
                                    <TableCell align='center' component='th' scope='row'>
                                        {digitsEnToFa(index + 1)}
                                    </TableCell>
                                    <TableCell align='center' component='th' scope='row'>
                                        {row.typeTitle}
                                    </TableCell>
                                    <TableCell align='center' component='th' scope='row'>
                                        <span>{row.tarrifTitle}</span>
                                    </TableCell>
                                    <TableCell align='center' component='th' scope='row'>
                                        <span>{row.tariffplanTitle}</span>
                                    </TableCell>
                                    <TableCell align='center' component='th' scope='row'>
                                        <div row={JSON.stringify(row)}>
                                            <span >{addCommas(digitsEnToFa(row.ownerPrice))} تومان</span>
                                        </div>
                                    </TableCell>
                                    <TableCell align='center' component='th' scope='row'>
                                        <div row={JSON.stringify(row)}>
                                            <Input id="price" onChange={(e) => changePrice(e, row)} defaultValue={row.price}></Input>
                                            <span >{addCommas(digitsEnToFa(row.price))} تومان</span>
                                        </div>
                                    </TableCell>
                                    <TableCell align='center' component='th' scope='row'>
                                        <div row={JSON.stringify(row)}>
                                            <Input id="agentprice" onChange={(e) => changePrice(e, row)} defaultValue={row.agentprice}></Input>
                                            <span >{addCommas(digitsEnToFa(row.agentprice))} تومان</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow style={{ paddingLeft: '100px' }}>
                                {error.isValid == false && <Alert severity={error.severity}>{error.errorMsg}</Alert>}
                                <Grid item xs={12} >

                                </Grid>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </>
        }

    </div>
}

export default AgentPriceComponent
