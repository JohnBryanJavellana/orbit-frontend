'use client';

import OrbitDatatable from "@/app/custom-global-components/OrbitDatatable/OrbitDatatable";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { IconButton, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import DropdownMenu from "@/app/custom-global-components/DropdownMenu/DropdowMenu";
import axios from "axios";
import CustomBreadcrumb from "@/app/custom-global-components/CustomBreadcrumb/CustomBreadcrumb";
import ModalCreateOrUpdateRole from "./components/ModalCreateOrUpdateRole";

export default function Roles() {
    const { getToken, removeToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const [roles, setRoles] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);

    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetMemberRoles = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/administrator/members/get_member_roles`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setRoles(response.data.memberRoles);
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
        GetMemberRoles(true);
        return () => { };
    }, []);

    const tableColumns = [
        {
            name: "ID#",
            selector: (row: any) => row.id,
            sortable: true,
            width: "170px"
        },
        {
            name: "Role",
            selector: (row: any) => row.role,
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
                        'data-target': `#create_or_update_role_${row.id}`,
                        'id': 'f',
                        'textColor': '',
                        'label': 'Update Role',
                        'onClick': () => {
                            setModalOpenData(row);
                            setModalOpenId(row.id);
                            setModalOpenIndex(0);
                        }
                    }
                ];

                if (row.has_data_count <= 0) {
                    menuItems.push({
                        'icon': 'delete',
                        'url': '#',
                        'data-toggle': '',
                        'data-target': ``,
                        'id': 'f',
                        'textColor': 'danger',
                        'label': 'Remove Role',
                        'onClick': () => { }
                    });
                }

                return <DropdownMenu id={row.id} menuItems={menuItems} />;
            },
            ignoreRowClick: true
        },
    ];

    return <>
        <CustomBreadcrumb
            pageName={[
                {
                    'name': 'Members',
                    'last': false
                },
                {
                    'name': 'Manage Roles',
                    'last': true,
                    'address': `/authenticated/administrator/members/roles`
                }
            ]}
        />

        {
            modalOpenIndex === 0 &&
            <ModalCreateOrUpdateRole
                data={modalOpenData}
                id={modalOpenId}
                titleHeader={modalOpenData ? 'Update Member Role' : 'Create Member Role'}
                httpMethod={modalOpenData ? 'UPDATE' : 'POST'}
                callbackFunction={() => {
                    GetMemberRoles(false);
                    setModalOpenData(null);
                    setModalOpenId(null);
                    setModalOpenIndex(null);
                }}
            />
        }

        <div className="card rounded-0 custom-bg custom-border-dark">
            <div className="card-header custom-bottom-border-dark py-1">
                <div className="d-flex align-items-center justify-content-between">
                    <div>Roles</div>
                    <div>
                        <Tooltip title="Add role">
                            <IconButton onClick={() => {
                                setModalOpenData(null);
                                setModalOpenId(0);
                                setModalOpenIndex(0);
                            }} data-target={`#create_or_update_role_0`} data-toggle="modal">
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
                    data={roles}
                    selectableRows={false}
                    selectedRows={null}
                />
            </div>
        </div>
    </>
}