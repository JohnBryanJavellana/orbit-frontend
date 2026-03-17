'use client';

import DropdownMenu from "@/app/custom-global-components/DropdownMenu/DropdowMenu";
import OrbitDatatable from "@/app/custom-global-components/OrbitDatatable/OrbitDatatable";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { Avatar, AvatarGroup, Chip, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";
import ModalCreateOrUpdateAnnouncement from "./components/ModalCreateOrUpdateAnnouncement";
import useDateFormat from "@/app/hooks/useDateFormat";
import ModalRemoveDocument from "@/app/custom-global-components/ModalRemoveDocument/ModalRemoveDocument";

export default function Announcements() {
    const { getToken, removeToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const { userData } = useGetCurrentUser();
    const [announcements, setAnnouncements] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const { FormatDatetimeToHumanReadable } = useDateFormat();
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetAnnouncements = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/administrator/announcement/get_announcements/get_announcements`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setAnnouncements(response.data.announcements);
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
            name: "CTRL#",
            selector: (row: any) => row.ctrl,
            sortable: true,
            width: "170px",
            style: {
                verticalAlign: 'top',
                alignItems: 'flex-start',
                paddingTop: '10px'
            },
            wrap: true
        },
        {
            name: "Content",
            cell: (row: any) => <div className="pt-2" dangerouslySetInnerHTML={{ __html: row.content }} />,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row: any) => row.status,
            cell: (row: any) => {
                return <span className={`text-bold text-${['SHOW'].includes(row.status) ? 'warning' : 'danger'}`}>{row.status}</span>
            },
            sortable: true,
            width: "230px",
            style: {
                verticalAlign: 'top',
                alignItems: 'flex-start',
                paddingTop: '10px'
            },
            wrap: true
        },
        {
            name: "Auto Remove Date",
            selector: (row: any) => row.removal_date ? FormatDatetimeToHumanReadable(row.removal_date, true) : <i className="text-muted">-- None --</i>,
            sortable: true,
            width: "230px",
            style: {
                verticalAlign: 'top',
                alignItems: 'flex-start',
                paddingTop: '10px'
            },
            wrap: true
        },
        {
            name: "Actions",
            cell: (row: any) => {
                const menuItems = [
                    {
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#create_or_update_announcement_${row.id}`,
                        'id': 'f',
                        'textColor': '',
                        'label': 'Update Announcement',
                        'onClick': () => {
                            setModalOpenData(row);
                            setModalOpenId(row.id);
                            setModalOpenIndex(0);
                        }
                    }, {
                        'icon': 'delete',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#remove_document_${row.id}`,
                        'id': 'f',
                        'textColor': 'danger',
                        'label': 'Remove Announcement',
                        'onClick': () => {
                            setModalOpenData(row);
                            setModalOpenId(row.id);
                            setModalOpenIndex(1);
                        }
                    }
                ];

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
            GetAnnouncements(true);
            return () => { };
        }
    }, [userData]);

    return <>
        {
            modalOpenIndex === 0 &&
            <ModalCreateOrUpdateAnnouncement
                data={modalOpenData}
                id={modalOpenId}
                titleHeader={modalOpenData ? 'Update Announcement' : 'Create Announcement'}
                httpMethod={modalOpenData ? 'UPDATE' : 'POST'}
                callbackFunction={() => {
                    GetAnnouncements(false);
                    setModalOpenData(null);
                    setModalOpenId(null);
                    setModalOpenIndex(null);
                }}
            />
        }

        {
            modalOpenIndex === 1 &&
            <ModalRemoveDocument
                apiSrc={`administrator/announcement/get_announcements/remove_announcement`}
                id={modalOpenId}
                titleHeader={'Remove Permission'}
                message={`Are you sure you want to remove this announcement? This cannot be undone.`}
                callbackFunction={() => {
                    GetAnnouncements(false);
                    setModalOpenData(null);
                    setModalOpenId(null);
                    setModalOpenIndex(null);
                }}
            />
        }

        <div className="card rounded-0 custom-bg custom-border-dark">
            <div className="card-header border-0 pt-1 pb-0">
                <div className="d-flex align-items-center justify-content-between">
                    <div>Announcements</div>
                    <div>
                        <Tooltip title="Add announcement">
                            <IconButton onClick={() => {
                                setModalOpenData(null);
                                setModalOpenId(0);
                                setModalOpenIndex(0);
                            }} data-target={`#create_or_update_announcement_0`} data-toggle="modal">
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
                    data={announcements}
                    selectableRows={false}
                    selectedRows={null}
                />
            </div>
        </div>
    </>;
}