'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useDateFormat from "@/app/hooks/useDateFormat";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { FormControl, Input } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import TablePaginationTemplate from "../CustomTablePaginationTemplate/CustomTablePaginationTemplate";

interface ModalShowMyPointsRecordProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: any) => void
}

export default function ModalShowMyPointsRecord({ data, id, titleHeader, callbackFunction }: ModalShowMyPointsRecordProps) {
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const [records, setRecords] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const { FormatDatetimeToHumanReadable } = useDateFormat();
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(12);
    const [searchText, setSearchText] = useState<string>('');

    const GetUserAuraRecord = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/administrator/aura_point_record/aura_point_record/get_aura_point_records`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setRecords(response.data.auraPointsRecord);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 500) {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        GetUserAuraRecord(true);
        return () => { };
    }, []);

    const handleClose = () => {
        $(`#show_my_points_record_${id}`).modal('hide');
        callbackFunction(null);
    }

    const filteredRecords = useMemo(() => {
        let result = Array.isArray(records) ? records : [];

        if (searchText.trim()) {
            result = result.filter(friend =>
                String(friend?.reason || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(friend?.point || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(friend?.status || '').toLowerCase().includes(searchText.toLowerCase())
            );
        }

        return result;
    }, [records, searchText]);

    return (
        <>
            <ModalTemplate
                id={`show_my_points_record_${id}`}
                size={"md"}
                isModalScrollable={false}
                modalContentClassName="text-white"
                isModalCentered
                headerClassName="border-0 pb-0"
                header={
                    <div className="w-100">
                        <div className="text-sm text-bold text-center w-100">{titleHeader}</div>
                        <hr className="style-two" />
                    </div>
                }
                bodyClassName="py-0"
                body={
                    <>
                        {
                            isFetching
                                ? <p>Please wait...</p>
                                : <>
                                    {
                                        records.length > 0
                                            ? <div>
                                                <FormControl fullWidth sx={{ mb: 3 }}>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        className='custom-field-bg'
                                                        value={searchText}
                                                        onChange={(e) => setSearchText(e.target.value)}
                                                        disableUnderline
                                                        size="small"
                                                        autoComplete='off'
                                                        placeholder='Search record...'
                                                    />
                                                </FormControl>

                                                {
                                                    filteredRecords.slice((page * rowsPerPage), ((page * rowsPerPage) + rowsPerPage)).map((rec: any, index: number) => (
                                                        <div key={index}>
                                                            <div className={`row`}>
                                                                <div className="col-xl-12">
                                                                    <h5 className={`text-bold text-${rec.status === 'INCREASE' ? 'success' : 'danger'}`}>
                                                                        {rec.status}
                                                                    </h5>
                                                                    <div className="text-sm">Points: {rec.point}</div>
                                                                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: rec.reason }} />

                                                                    <div className="text-sm text-muted mt-2">{FormatDatetimeToHumanReadable(rec.created_at, true)}</div>
                                                                </div>
                                                            </div>

                                                            {index < filteredRecords.length - 1 && <hr className="style-two" />}
                                                        </div>
                                                    ))
                                                }

                                                <TablePaginationTemplate
                                                    dataset={filteredRecords}
                                                    rowsPerPage={rowsPerPage}
                                                    rowsPerPageOptions={[12, 24, 36, 50]}
                                                    page={page}
                                                    labelRowsPerPage={"Records per page:"}
                                                    callbackFunction={(e) => {
                                                        setRowsPerPage(e.rows);
                                                        setPage(e.page);
                                                    }}

                                                />
                                            </div> : <p>You do not have any points record yet.</p>
                                    }
                                </>
                        }
                    </>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />
                        <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>
                    </div>
                }
            />
        </>
    );
}