import useDateFormat from "@/app/hooks/useDateFormat";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { Box, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { ParamValue } from "next/dist/server/request/params";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import ModalCreateOrUpdateTask from "../../../tab2/components/ModalCreateOrUpdateTask";
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";
import CustomAvatarWithOnlineBadge from "@/app/custom-global-components/CustomAvatarWithOnlineBadge/CustomAvatarWithOnlineBadge";
import useGetRankAttribute from "@/app/hooks/useGetRankAttribute";
import DropdownMenu from "@/app/custom-global-components/DropdownMenu/DropdowMenu";
import OrbitDatatable from "@/app/custom-global-components/OrbitDatatable/OrbitDatatable";
import ModalAddCollaborator from "@/app/custom-global-components/ModalAddCollaborator/ModalAddCollaborator";
import ModalUpdateCollaboratorStatus from "@/app/custom-global-components/ModalUpdateCollaboratorStatus/ModalUpdateCollaboratorStatus";
import ModalViewUser from "@/app/custom-global-components/CustomUserPill/components/ModalViewUser";

export default function ViewTaskTab2({ projectCtrl, taskCtrl }: { projectCtrl: ParamValue, taskCtrl: ParamValue }) {
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const navigate = useRouter();
    const { getRankAttribute } = useGetRankAttribute();
    const { userData } = useGetCurrentUser();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [currentTask, setCurrentTask] = useState<any | null>(null);
    const [taskCollaborators, setProjectTaskCollaborators] = useState<any | null>([]);
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetSpecificTaskCollaborators = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('csrf-token');

            const response = await axios.post(`${urlWithApi}/administrator/projects/get_projects/get_project_tasks/get_project_task_collaborators`, {
                taskCtrl: taskCtrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProjectTaskCollaborators(response.data.members);
            setCurrentTask(response.data.task);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 500) {
                    alert(error.response?.data.message);
                } else {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        if (userData) {
            GetSpecificTaskCollaborators(true);
            return () => { };
        }
    }, [projectCtrl, taskCtrl, userData]);

    const tableColumns = [
        {
            name: "Avatar",
            cell: (row: any) => {
                return <div className="w-100 d-flex align-items-center justify-content-center">
                    <CustomAvatarWithOnlineBadge
                        data={row.user}
                        src={`${urlWithoutApi}/user-images/${row.user.profile_picture}`}
                        isOnline={row.user.is_online}
                        isAdmin={row.user.role === "SUPERADMIN"}
                    />
                </div>
            },
            sortable: true,
            width: "100px"
        },
        {
            name: "Status",
            selector: (row: any) => row.status,
            sortable: true,
            width: "170px"
        },
        {
            name: "Full name",
            selector: (row: any) => `${row.user.first_name} ${row.user.middle_name} ${row.user.last_name} ${row.user.suffix ?? ''}`,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row: any) => row.user.email,
            sortable: true,
        },
        {
            name: "Aura",
            cell: (row: any) => {
                const points = ["ADMINISTRATOR"].includes(row.user.role) ? '∞' : ["SUPERADMIN"].includes(row.user.role) ? 'Ω' : row.user.total_points || 0;
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
                        'data-target': `#view_user_details_${row.user.id}`,
                        'id': 'f',
                        'textColor': '',
                        'label': 'View Collaborator',
                        'onClick': () => {
                            setModalOpenData(row.user);
                            setModalOpenId(row.user.id);
                            setModalOpenIndex(1);
                        }
                    }
                ];

                if (currentTask?.creator_id === userData?.id || userData?.role === "SUPERADMIN") {
                    menuItems.push({
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#update_collaborator_status_${row.id}`,
                        'id': 'f',
                        'textColor': 'warning',
                        'label': 'Update Collaborator Status',
                        'onClick': () => {
                            setModalOpenData({
                                ...row,
                                taskCtrl: taskCtrl
                            });
                            setModalOpenId(row.id);
                            setModalOpenIndex(2);
                        }
                    });
                }

                return <DropdownMenu id={row.id} menuItems={menuItems} />;
            },
            ignoreRowClick: true
        },
    ];

    return (
        <>
            {
                modalOpenIndex === 0 &&
                <ModalAddCollaborator
                    data={modalOpenData}
                    id={modalOpenId}
                    type="MAIN_TASK"
                    src="administrator/projects/get_projects/get_future_collaborators"
                    titleHeader={'Add Collaborator'}
                    httpMethod={'POST'}
                    callbackFunction={() => {
                        GetSpecificTaskCollaborators(false);
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            {
                modalOpenIndex === 1 &&
                <ModalViewUser
                    user={modalOpenData}
                    callbackFunction={() => {
                        GetSpecificTaskCollaborators(false);
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            {
                modalOpenIndex === 2 &&
                <ModalUpdateCollaboratorStatus
                    data={modalOpenData}
                    id={modalOpenId}
                    type="MAIN_TASK"
                    titleHeader={'Update Collaborator Status'}
                    httpMethod={'POST'}
                    callbackFunction={() => {
                        GetSpecificTaskCollaborators(false);
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            {
                isFetching
                    ? <div className="p-4">Loading ....</div>
                    : <div className="card rounded-0 custom-bg elevation-0 mb-0">
                        {
                            (currentTask?.creator_id === userData?.id || userData?.role === "SUPERADMIN") &&
                            <div className="card-header custom-bottom-border-dark py-1">
                                <div className="d-flex align-items-center justify-content-end">
                                    <div>
                                        <Tooltip title="Add collaborator">
                                            <IconButton disabled={['COMPLETED'].includes(currentTask?.status) || (currentTask?.creator_id !== userData?.id && userData?.role !== "SUPERADMIN")} onClick={() => {
                                                setModalOpenData({
                                                    taskCtrl: taskCtrl,
                                                    projectCtrl: projectCtrl
                                                });
                                                setModalOpenId(taskCollaborators?.id);
                                                setModalOpenIndex(0);
                                            }} data-target={`#add_collaborator_${taskCollaborators?.id}`} data-toggle="modal">
                                                <AddIcon color='error' />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        }


                        <div className="card-body">
                            <OrbitDatatable
                                withExport
                                progressPending={isFetching}
                                columns={tableColumns}
                                data={taskCollaborators}
                                selectableRows={false}
                                selectedRows={null}
                            />
                        </div>
                    </div>
            }
        </>
    );
}