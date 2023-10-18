
import { useState } from "react";
import { useEffect } from "react";
import { Button, Alert } from '@mui/material/'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { useSession } from 'next-auth/react';
export const SubAgentsTable = props => {
    const [rows, setRow] = useState([]);
    const [loading, setLoading] = useState(false);
    const { data: session, status } = useSession();
    useEffect(() => {
        if (props.subAgents != undefined) {
            setRow(props.subAgents);
            setLoading(true);
        }

    }, [props]);

    async function btnShowDetailHandler(e) {
        var row = JSON.parse(e.target.getAttribute("row"));
        props.btnShowDetailHandler(row);
    }

    async function btnManaginWalletHandler(e) {
        var row = JSON.parse(e.target.getAttribute("row"));
        props.btnManaginWalletHandler(row);
    }

    async function btnIncreateAgentHandler(e) {
        var row = JSON.parse(e.target.getAttribute("row"));
        props.btnIncreateAgentHandler(row);
    }

    async function btnDecAgentHandler(e) {
        var row = JSON.parse(e.target.getAttribute("row"));
        props.btnDecAgentHandler(row);
    }



    function btnLoadingAgents(e) {
        props.GetAllSubAgentsFunc();
    }
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Grid container spacing={6}>
                <Grid item xs={1}></Grid>
                <Grid item xs={2}>
                    <Button size='small' onClick={btnLoadingAgents} type='submit' sx={{ mr: 2 }} variant='contained'>
                        دریافت اطلاعات
                    </Button>
                </Grid>
            </Grid>
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
            }} component={Paper}>
                {
                    loading == false &&
                    <Alert severity="info">در حال بارگزاری اطلاعات لطفا منتظر بمانید...</Alert>
                }
                <Table stickyHeader sx={{ minWidth: 400, touchAction: 'manipulation' }} style={{ userSelect: 'none' }} aria-label='لطفا از سرورهای زیر انتخاب نمایید.'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>شماره ردیف</TableCell>
                            <TableCell align='center'>نام نماینده</TableCell>
                            <TableCell align='center'>کد ایجنتی</TableCell>
                            <TableCell align='center'>عملیات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows != undefined && rows.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    '&:last-of-type td, &:last-of-type th': {
                                        border: 0
                                    }
                                }}
                            >
                                <TableCell align='center' component='th' scope='row'>
                                    {index + 1}
                                </TableCell>
                                <TableCell align='center' component='th' scope='row'>
                                    {row.name}
                                </TableCell>
                                <TableCell align='center' component='th' scope='row'>
                                    {row.agentcode}
                                </TableCell>

                                <TableCell align='center' component='th' scope='row'>
                                    <div className="delete-img-con btn-for-select" style={{ width: '120px', cursor: 'pointer', fontWeight: 'bolder', color: 'blue' }} row={JSON.stringify(row)} onClick={btnShowDetailHandler}>
                                        مدیریت کاربران ایجنت
                                    </div>
                                    <div className="delete-img-con btn-for-select" style={{ width: '120px', cursor: 'pointer', fontWeight: 'bolder', color: 'blue' }} row={JSON.stringify(row)} onClick={btnManaginWalletHandler}>
                                        مدیریت کیف پول ایجنت
                                    </div>
                                    {
                                        session.user.isAdmin == true && (
                                            <div className="delete-img-con btn-for-select" style={{ width: '120px', cursor: 'pointer', fontWeight: 'bolder', color: 'blue' }} row={JSON.stringify(row)} onClick={btnIncreateAgentHandler}>
                                                افزایش اعتبار
                                            </div>
                                        )
                                    }
                                    {
                                        session.user.isAdmin == true && (
                                            <div className="delete-img-con btn-for-select" style={{ width: '120px', cursor: 'pointer', fontWeight: 'bolder', color: 'blue' }} row={JSON.stringify(row)} onClick={btnDecAgentHandler}>
                                                کاهش بدهی 
                                            </div>
                                        )
                                    }

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        {
                            loading == true &&
                            <TableRow style={{ paddingLeft: '100px' }}>

                                {/* <div style={{ paddingRight: '30px', paddingTop: '30px', paddingBottom: '15px' }}>
                                    <Alert severity="success">{errors.errorMsg}</Alert>
                                </div> */}
                            </TableRow>
                        }

                    </TableFooter>
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default SubAgentsTable;