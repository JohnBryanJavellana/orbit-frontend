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
import ModalCreateOrUpdateMember from "./components/ModalCreateOrUpdateMember";
import CustomAvatarWithOnlineBadge from "@/app/custom-global-components/CustomAvatarWithOnlineBadge/CustomAvatarWithOnlineBadge";
import useGetRankAttribute from "@/app/hooks/useGetRankAttribute";
import ModalViewUser from "@/app/custom-global-components/CustomUserPill/components/ModalViewUser";
import ModalViewUserInAdmin from "./components/ModalViewUserInAdmin";

export default function Members() {
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const [members, setMembers] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const { getRankAttribute } = useGetRankAttribute();
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetMembers = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/administrator/members/get_members`, {
                excludeOmega: true
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMembers(response.data.members);
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
        GetMembers(true);
        return () => { };
    }, []);

    const tableColumns = [
        {
            name: "Avatar",
            cell: (row: any) => {
                return <CustomAvatarWithOnlineBadge data={row} src={`${urlWithoutApi}/user-images/${row.profile_picture}`} isOnline={row.is_online} srcShown={row.custom_avatar.shown_avatar} />
            },
            sortable: true,
            width: "130px"
        },
        {
            name: "Account Role",
            selector: (row: any) => row.role,
            sortable: true,
            width: "170px"
        },
        {
            name: "Full name",
            selector: (row: any) => `${row.first_name} ${row.middle_name} ${row.last_name} ${row.suffix ?? ''}`,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row: any) => row.email,
            sortable: true,
        },
        {
            name: "Aura",
            cell: (row: any) => {
                const points = ["ADMINISTRATOR"].includes(row.role) ? '∞' : ["SUPERADMIN"].includes(row.role) ? 'Ω' : row.total_points || 0;
                return getRankAttribute(points);
            },
            sortable: true,
            sortFunction: (rowA: any, rowB: any) => rowA.total_points - rowB.total_points
        },
        {
            name: "Actions",
            cell: (row: any) => {
                const menuItems = [
                    {
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#view_user_in_admin_${row.id}`,
                        'id': 'f',
                        'textColor': '',
                        'label': 'View Member',
                        'onClick': () => {
                            setModalOpenData(row);
                            setModalOpenId(row.id);
                            setModalOpenIndex(1);
                        }
                    }, {
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#create_or_update_member_${row.id}`,
                        'id': 'f',
                        'textColor': '',
                        'label': 'Update Member',
                        'onClick': () => {
                            setModalOpenData({
                                ...row,
                                editor: 'OMEGA'
                            });
                            setModalOpenId(row.id);
                            setModalOpenIndex(0);
                        }
                    }, {
                        'icon': 'delete',
                        'url': '#',
                        'data-toggle': '',
                        'data-target': ``,
                        'id': 'f',
                        'textColor': 'danger',
                        'label': 'Remove Member'
                    }
                ];

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
                    'name': 'View All Members',
                    'last': true,
                    'address': `/authenticated/administrator/members/view-all`
                }
            ]}
        />

        {
            modalOpenIndex === 0 &&
            <ModalCreateOrUpdateMember
                data={modalOpenData}
                id={modalOpenId}
                titleHeader={modalOpenData ? 'Update Member' : 'Create Member'}
                httpMethod={modalOpenData ? 'UPDATE' : 'POST'}
                callbackFunction={() => {
                    GetMembers(false);
                    setModalOpenData(null);
                    setModalOpenId(null);
                    setModalOpenIndex(null);
                }}
            />
        }

        {
            modalOpenIndex === 1 &&
            <ModalViewUserInAdmin
                data={modalOpenData}
                id={modalOpenId}
                titleHeader={'Member Information'}
                httpMethod={modalOpenData ? 'UPDATE' : 'POST'}
                callbackFunction={() => {
                    GetMembers(false);
                    setModalOpenData(null);
                    setModalOpenId(null);
                    setModalOpenIndex(null);
                }}
            />
        }

        <div className="card rounded-0 custom-bg custom-border-dark">
            <div className="card-header border-0 pt-1 pb-0">
                <div className="d-flex align-items-center justify-content-between">
                    <div>Members</div>
                    <div>
                        <Tooltip title="Add member">
                            <IconButton onClick={() => {
                                setModalOpenData(null);
                                setModalOpenId(0);
                                setModalOpenIndex(0);
                            }} data-target={`#create_or_update_member_0`} data-toggle="modal">
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
                    data={members}
                    selectableRows={false}
                    selectedRows={null}
                />
            </div>
        </div>
    </>
}