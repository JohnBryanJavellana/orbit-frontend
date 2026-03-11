'use client';

import OrbitDatatable from "@/app/custom-global-components/OrbitDatatable/OrbitDatatable";
import useDateFormat from "@/app/hooks/useDateFormat";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ModalModifyPoints from "./ModalModifyPoints";

export default function ViewUserAuraPointsRecordInAdmin({ userId }: { userId: number }) {
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const [records, setRecords] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const { FormatDatetimeToHumanReadable } = useDateFormat();

    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetUserAuraRecord = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/administrator/aura_point_record/aura_point_record/get_aura_point_records`, {
                userId: userId
            }, {
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
    }, [userId]);

    const tableColumns = [
        {
            name: "Datetime",
            selector: (row: any) => {
                return FormatDatetimeToHumanReadable(row.created_at, true)
            },
            width: "270px",
            sortable: true,
            style: {
                verticalAlign: 'top',
                alignItems: 'flex-start',
                paddingTop: '17px'
            },
            wrap: true
        },
        {
            name: "Type",
            selector: (row: any) => row.status,
            cell: (row: any) => <span className={`material-icons-outlined text-${row.status === 'INCREASE' ? 'success' : 'danger'}`}>{row.status === 'INCREASE' ? 'trending_up' : 'trending_down'}</span>,
            sortable: true,
            width: "150px",
            style: {
                verticalAlign: 'top',
                alignItems: 'flex-start',
                paddingTop: '12px'
            },
            wrap: true
        },
        {
            name: "Points",
            selector: (row: any) => row.point,
            sortable: true,
            width: "150px",
            style: {
                verticalAlign: 'top',
                alignItems: 'flex-start',
                paddingTop: '12px'
            },
            wrap: true
        },
        {
            name: "Content",
            cell: (row: any) => <div dangerouslySetInnerHTML={{ __html: row.reason }} />,
            sortable: true,
        }
    ];

    return (
        <>
            {
                modalOpenIndex === 0 &&
                <ModalModifyPoints
                    data={modalOpenData}
                    id={modalOpenId}
                    titleHeader={'Modify Points'}
                    callbackFunction={() => {
                        GetUserAuraRecord(false);
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            <div className="d-flex align-items-center justify-content-end px-3 pt-2">
                <button className="rpg-button px-3" style={{ height: '40px' }} onClick={() => {
                    setModalOpenData({
                        userId: userId
                    });
                    setModalOpenId(userId);
                    setModalOpenIndex(0);
                }} data-target={`#modal_modify_points_${userId}`} data-toggle="modal">Modify Points</button>
            </div>
            <hr className="style-two" />

            <div className="p-3">
                <OrbitDatatable
                    withExport
                    progressPending={isFetching}
                    columns={tableColumns}
                    data={records}
                    selectableRows={false}
                    selectedRows={null}
                />
            </div>
        </>
    );
}