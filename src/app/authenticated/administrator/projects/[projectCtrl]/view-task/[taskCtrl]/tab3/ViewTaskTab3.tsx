import useDateFormat from "@/app/hooks/useDateFormat";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { Box, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { ParamValue } from "next/dist/server/request/params";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";
import CustomAvatarWithOnlineBadge from "@/app/custom-global-components/CustomAvatarWithOnlineBadge/CustomAvatarWithOnlineBadge";
import useGetRankAttribute from "@/app/hooks/useGetRankAttribute";
import DropdownMenu from "@/app/custom-global-components/DropdownMenu/DropdowMenu";
import OrbitDatatable from "@/app/custom-global-components/OrbitDatatable/OrbitDatatable";
import ModalAddCollaborator from "@/app/custom-global-components/ModalAddCollaborator/ModalAddCollaborator";
import ModalUpdateCollaboratorStatus from "@/app/custom-global-components/ModalUpdateCollaboratorStatus/ModalUpdateCollaboratorStatus";
import ModalViewUser from "@/app/custom-global-components/CustomUserPill/components/ModalViewUser";
import ModalViewProgress from "./components/ModalViewProgress";
import ModalUpdateProgress from "./components/ModalUpdateProgress";

export default function ViewTaskTab3({ projectCtrl, taskCtrl }: { projectCtrl: ParamValue, taskCtrl: ParamValue }) {
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const { userData } = useGetCurrentUser();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [taskProgress, setTaskProgress] = useState<any | null>([]);
    const { FormatDatetimeToHumanReadable } = useDateFormat();
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetTaskProgress = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('csrf-token');

            const response = await axios.post(`${urlWithApi}/administrator/projects/get_projects/get_project_tasks/get_task_progress`, {
                taskCtrl: taskCtrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTaskProgress(response.data.progress);
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
            GetTaskProgress(true);
            return () => { };
        }
    }, [projectCtrl, taskCtrl, userData]);

    const tableColumns = [
        {
            name: "Collaborator",
            selector: (row: any) => `${row.initiator.user.first_name} ${row.initiator.user.middle_name} ${row.initiator.user.last_name} ${row.initiator.user.suffix ?? ''}`,
            sortable: true,
            style: {
                verticalAlign: 'top',
                alignItems: 'flex-start',
                paddingTop: '10px'
            },
            wrap: true
        },
        {
            name: "Activity",
            cell: (row: any) => <div className="pt-2" dangerouslySetInnerHTML={{ __html: row.activity }} />,
            sortable: true,
            width: "300px"
        },
        {
            name: "Submitted at",
            selector: (row: any) => FormatDatetimeToHumanReadable(row.created_at, true),
            sortable: true,
            style: {
                verticalAlign: 'top',
                alignItems: 'flex-start',
                paddingTop: '10px'
            },
            wrap: true
        },
        {
            name: "Status",
            selector: (row: any) => row.status,
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
            name: "Actions",
            cell: (row: any) => {
                const menuItems = [
                    {
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#view_user_details_${row.initiator.user.id}`,
                        'id': 'f',
                        'textColor': '',
                        'label': 'View Collaborator',
                        'onClick': () => {
                            setModalOpenData(row.initiator.user);
                            setModalOpenId(row.initiator.user.id);
                            setModalOpenIndex(1);
                        }
                    },
                    {
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#task_progress_${row.id}`,
                        'id': 'f',
                        'textColor': '',
                        'label': 'View Progress',
                        'onClick': () => {
                            setModalOpenData(row);
                            setModalOpenId(row.id);
                            setModalOpenIndex(3);
                        }
                    }
                ];

                if (row.status !== 'VERIFIED') {
                    menuItems.push({
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#update_progress_status_${row.id}`,
                        'id': 'f',
                        'textColor': 'warning',
                        'label': 'Update Progress Status',
                        'onClick': () => {
                            setModalOpenData(row);
                            setModalOpenId(row.id);
                            setModalOpenIndex(2);
                        }
                    })
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

    return (
        <>
            {
                modalOpenIndex === 1 &&
                <ModalViewUser
                    user={modalOpenData}
                    callbackFunction={() => {
                        GetTaskProgress(false);
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            {
                modalOpenIndex === 2 &&
                <ModalUpdateProgress
                    data={modalOpenData}
                    id={modalOpenId}
                    titleHeader={'Update Progress Status'}
                    httpMethod={'UPDATE'}
                    callbackFunction={() => {
                        GetTaskProgress(false);
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            {
                modalOpenIndex === 3 &&
                <ModalViewProgress
                    data={modalOpenData}
                    id={modalOpenId}
                    titleHeader={'Progress Details'}
                    httpMethod={'POST'}
                    callbackFunction={() => {
                        GetTaskProgress(false);
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
                        <div className="card-body">
                            <OrbitDatatable
                                withExport
                                progressPending={isFetching}
                                columns={tableColumns}
                                data={taskProgress}
                                selectableRows={false}
                                selectedRows={null}
                            />
                        </div>
                    </div>
            }
        </>
    );
}