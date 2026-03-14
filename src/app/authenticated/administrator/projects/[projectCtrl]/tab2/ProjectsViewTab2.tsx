import DropdownMenu from "@/app/custom-global-components/DropdownMenu/DropdowMenu";
import OrbitDatatable from "@/app/custom-global-components/OrbitDatatable/OrbitDatatable";
import useDateFormat from "@/app/hooks/useDateFormat";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { Avatar, AvatarGroup, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { ParamValue } from "next/dist/server/request/params";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import ModalCreateOrUpdateTask from "./components/ModalCreateOrUpdateTask";
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";

export default function ProjectsViewTab2({ projectCtrl }: { projectCtrl: ParamValue }) {
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const navigate = useRouter();
    const { userData } = useGetCurrentUser();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [project, setProject] = useState<any | null>(null);
    const [projectTasks, setProjectTasks] = useState<any>([]);
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetProjectTasks = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('csrf-token');

            const response = await axios.post(`${urlWithApi}/administrator/projects/get_projects/get_project_tasks`, {
                projectCtrl: projectCtrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProjectTasks(response.data.tasks);
            setProject(response.data.project);
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
            GetProjectTasks(true);
            return () => { };
        }
    }, [projectCtrl, userData]);

    const tableColumns = [
        {
            name: "CTRL#",
            selector: (row: any) => row.ctrl,
            sortable: true,
            width: "170px"
        },
        {
            name: "Name",
            selector: (row: any) => row.name,
            sortable: true,
            width: "270px"
        },
        {
            name: "Members",
            width: "200px",
            sortable: true,
            cell: (row: any) => {
                return (
                    <AvatarGroup
                        max={4}
                        sx={{
                            '& .MuiAvatar-root': {
                                width: 25,
                                height: 25,
                                fontSize: '0.75rem',
                                border: '0px solid #fff'
                            }
                        }}
                    >
                        {row.members && row.members.length > 0 ? (
                            row.members.map((member: any, index: number) => {
                                const name = `${member.user.first_name} ${member.user.last_name}`;

                                const initSource = member.user.custom_avatar.shown_avatar === "MAIN" ? member.user.custom_avatar.profile_picture : member.user.custom_avatar.custom_avatar.filename;
                                const finalUrlSrc = `${urlWithoutApi}/${member.user.custom_avatar.shown_avatar === "MAIN" ? 'user-images' : 'custom-avatar-images'}/${initSource}`;

                                return (
                                    <Tooltip key={index} title={name} arrow>
                                        <Avatar
                                            alt={name}
                                            src={finalUrlSrc ? finalUrlSrc : undefined}
                                        >
                                            {!finalUrlSrc && name.charAt(0)}
                                        </Avatar>
                                    </Tooltip>
                                );
                            })
                        ) : (
                            <i className="text-muted">-- None --</i>
                        )}
                    </AvatarGroup>
                );
            },
        },
        {
            name: "Completion Points",
            selector: (row: any) => `+${row.task_completion_points}`,
            sortable: true,
            width: "230px"
        },
        {
            name: "Progress Points",
            selector: (row: any) => `+${row.task_progress_points}`,
            sortable: true,
            width: "160px"
        },
        {
            name: "Status",
            selector: (row: any) => row.status,
            cell: (row: any) => {
                return <span className={`text-bold text-${['OPEN', 'IN PROGRESS'].includes(row.status) ? 'warning' : 'danger'}`}>{row.status}</span>
            },
            sortable: true,
            width: "160px"
        },
        {
            name: "Actions",
            cell: (row: any) => {
                const menuItems = [
                    {
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#task_view_${row.id}`,
                        'id': 'f',
                        'textColor': '',
                        'label': 'View Task',
                        'onClick': () => {
                            navigate.push(`/authenticated/administrator/projects/${projectCtrl}/view-task/${row.ctrl}`);
                        }
                    }
                ];

                if (!['ABANDONED', 'COMPLETED', 'IN PROGRESS'].includes(row?.status) && (row.creator.id === userData.id || userData.role === "SUPERADMIN")) {
                    menuItems.push({
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#task_${row.id}`,
                        'id': 'f',
                        'textColor': 'warning',
                        'label': 'Update Task',
                        'onClick': () => {
                            setModalOpenData({
                                ...row,
                                projectCtrl: projectCtrl,
                                trueData: true
                            });
                            setModalOpenId(row.id);
                            setModalOpenIndex(0);
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
                <ModalCreateOrUpdateTask
                    data={modalOpenData}
                    id={modalOpenId}
                    titleHeader={modalOpenData && modalOpenData.trueData ? 'Update Task' : 'Create Task'}
                    httpMethod={modalOpenData && modalOpenData.trueData ? 'UPDATE' : 'POST'}
                    callbackFunction={() => {
                        GetProjectTasks(false);
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            <div className="card rounded-0 custom-bg elevation-0 mb-0">
                {
                    !['ABANDONED', 'COMPLETED'].includes(project?.status) && (project?.creator_id === userData?.id || userData?.role === "SUPERADMIN") &&
                    <div className="card-header pt-1 pb-0 border-0">
                        <div className="d-flex align-items-center justify-content-end">
                            <div>
                                <Tooltip title="Add task">
                                    <IconButton disabled={['ABANDONED', 'COMPLETED'].includes(project?.status) && (project?.creator_id !== userData?.id && userData?.role !== "SUPERADMIN")} onClick={() => {
                                        setModalOpenData({
                                            projectCtrl: projectCtrl,
                                            trueData: false
                                        });
                                        setModalOpenId(0);
                                        setModalOpenIndex(0);
                                    }} data-target={`#task_0`} data-toggle="modal">
                                        <AddIcon color='error' />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        <hr className="style-two" />
                    </div>
                }

                <div className={`card-body ${!['ABANDONED', 'COMPLETED'].includes(project?.status) && (project?.creator_id === userData?.id || userData?.role === "SUPERADMIN") && 'pt-0'}`}>
                    <OrbitDatatable
                        withExport
                        progressPending={isFetching}
                        columns={tableColumns}
                        data={projectTasks}
                        selectableRows={false}
                        selectedRows={null}
                    />
                </div>
            </div>
        </>
    );
}