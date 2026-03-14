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
import ModalCreateOrUpdateAvatar from "./components/ModalCreateOrUpdateAvatar";
import ModalRemoveDocument from "@/app/custom-global-components/ModalRemoveDocument/ModalRemoveDocument";

export default function Avatars() {
    const { getToken, removeToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const { userData } = useGetCurrentUser();
    const [customAvatars, setCustomAvatars] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetCustomAvatars = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/administrator/avatar/avatar/get_custom_avatars`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCustomAvatars(response.data.avatars);
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
            name: "ID#",
            selector: (row: any) => row.id,
            sortable: true,
            width: '170px'
        },
        {
            name: "Avatar",
            cell: (row: any) => <>
                <img src={`${urlWithoutApi}/custom-avatar-images/${row.filename}`} height={50} />
            </>,
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row: any) => {
                const menuItems = [
                    {
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#create_or_update_avatar_${row.id}`,
                        'id': 'f',
                        'textColor': '',
                        'label': 'Update Avatar',
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
            GetCustomAvatars(true);
            return () => { };
        }
    }, [userData]);

    return <>
        {
            modalOpenIndex === 0 &&
            <ModalCreateOrUpdateAvatar
                data={modalOpenData}
                id={modalOpenId}
                titleHeader={modalOpenData ? 'Update Avatar' : 'Create Avatar'}
                httpMethod={modalOpenData ? 'UPDATE' : 'POST'}
                callbackFunction={() => {
                    GetCustomAvatars(false);
                    setModalOpenData(null);
                    setModalOpenId(null);
                    setModalOpenIndex(null);
                }}
            />
        }

        {
            modalOpenIndex === 1 &&
            <ModalRemoveDocument
                apiSrc={`administrator/avatar/avatar/remove_custom_avatar`}
                id={modalOpenId}
                titleHeader={'Remove Permission'}
                message={`Are you sure you want to remove this custom avatar? This cannot be undone.`}
                callbackFunction={() => {
                    GetCustomAvatars(false);
                    setModalOpenData(null);
                    setModalOpenId(null);
                    setModalOpenIndex(null);
                }}
            />
        }

        <div className="card rounded-0 custom-bg custom-border-dark">
            <div className="card-header custom-bottom-border-dark py-1">
                <div className="d-flex align-items-center justify-content-between">
                    <div>Avatars</div>
                    <div>
                        <Tooltip title="Add custom avatar">
                            <IconButton onClick={() => {
                                setModalOpenData(null);
                                setModalOpenId(0);
                                setModalOpenIndex(0);
                            }} data-target={`#create_or_update_avatar_0`} data-toggle="modal">
                                <AddIcon color='error' />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </div>

            <div className="card-body text-sm">
                <OrbitDatatable
                    withExport
                    progressPending={isFetching}
                    columns={tableColumns}
                    data={customAvatars}
                    selectableRows={false}
                    selectedRows={null}
                />
            </div>
        </div>
    </>;
}