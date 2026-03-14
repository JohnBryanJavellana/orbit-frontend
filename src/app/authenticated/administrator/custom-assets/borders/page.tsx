'use client';

import DropdownMenu from "@/app/custom-global-components/DropdownMenu/DropdowMenu";
import OrbitDatatable from "@/app/custom-global-components/OrbitDatatable/OrbitDatatable";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";
import ModalCreateOrUpdateBorder from "./components/ModalCreateOrUpdateBorder";
import ModalRemoveDocument from "@/app/custom-global-components/ModalRemoveDocument/ModalRemoveDocument";

export default function Borders() {
    const { getToken, removeToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const { userData } = useGetCurrentUser();
    const [borders, setBorders] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetBorders = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/administrator/border/border/get_custom_borders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBorders(response.data.borders);
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

    const tableColumns = [
        {
            name: "Border",
            cell: (row: any) => <>
                <img src={`${urlWithoutApi}/border-images/${row.filename}`} height={50} />
            </>,
            sortable: true,
        },
        {
            name: "Type",
            selector: (row: any) => row.type,
            cell: (row: any) => <span className={`text-bold text-${row.type === 'FREE' ? 'success' : 'warning'}`}>{row.type}</span>,
            sortable: true
        },
        {
            name: "Actions",
            cell: (row: any) => {
                const menuItems = [
                    {
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#create_or_update_border_${row.id}`,
                        'id': 'f',
                        'textColor': '',
                        'label': 'Update Border',
                        'onClick': () => {
                            setModalOpenData(row);
                            setModalOpenId(row.id);
                            setModalOpenIndex(0);
                        }
                    }
                ];

                if (row.total_active_users <= 0) {
                    menuItems.push({
                        'icon': 'delete',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#remove_document_${row.id}`,
                        'id': 'f',
                        'textColor': 'danger',
                        'label': 'Remove Border',
                        'onClick': () => {
                            setModalOpenData(row);
                            setModalOpenId(row.id);
                            setModalOpenIndex(1);
                        }
                    });
                }

                return <DropdownMenu id={row.id} menuItems={menuItems} />;
            },
            ignoreRowClick: true,
            style: {
                verticalAlign: 'top',
                alignItems: 'flex-start',
                paddingTop: '10px'
            },
            wrap: true
        },
    ];

    useEffect(() => {
        if (userData) {
            GetBorders(true);
            return () => { };
        }
    }, [userData]);

    return <>
        {
            modalOpenIndex === 0 &&
            <ModalCreateOrUpdateBorder
                data={modalOpenData}
                id={modalOpenId}
                titleHeader={modalOpenData ? 'Update Border' : 'Create Border'}
                httpMethod={modalOpenData ? 'UPDATE' : 'POST'}
                callbackFunction={() => {
                    GetBorders(false);
                    setModalOpenData(null);
                    setModalOpenId(null);
                    setModalOpenIndex(null);
                }}
            />
        }

        {
            modalOpenIndex === 1 &&
            <ModalRemoveDocument
                apiSrc={`administrator/border/border/remove_custom_border`}
                id={modalOpenId}
                titleHeader={'Remove Permission'}
                message={`Are you sure you want to remove this border? This cannot be undone.`}
                callbackFunction={() => {
                    GetBorders(false);
                    setModalOpenData(null);
                    setModalOpenId(null);
                    setModalOpenIndex(null);
                }}
            />
        }

        <div className="card rounded-0 custom-bg custom-border-dark">
            <div className="card-header border-0 pt-1 pb-0">
                <div className="d-flex align-items-center justify-content-between">
                    <div>Borders</div>
                    <div>
                        <Tooltip title="Add border">
                            <IconButton onClick={() => {
                                setModalOpenData(null);
                                setModalOpenId(0);
                                setModalOpenIndex(0);
                            }} data-target={`#create_or_update_border_0`} data-toggle="modal">
                                <AddIcon color='error' />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <hr className="style-two" />
            </div>

            <div className="card-body pt-0 text-sm">
                <OrbitDatatable
                    withExport
                    progressPending={isFetching}
                    columns={tableColumns}
                    data={borders}
                    selectableRows={false}
                    selectedRows={null}
                />
            </div>
        </div>
    </>;
}