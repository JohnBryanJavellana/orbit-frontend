import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { Box, FormControl, IconButton, Input, Tooltip } from "@mui/material";
import axios from "axios";
import { ParamValue } from "next/dist/server/request/params";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";
import CustomAvatarWithOnlineBadge from "@/app/custom-global-components/CustomAvatarWithOnlineBadge/CustomAvatarWithOnlineBadge";
import useGetRankAttribute from "@/app/hooks/useGetRankAttribute";
import ModalViewUser from "@/app/custom-global-components/CustomUserPill/components/ModalViewUser";
import TablePaginationTemplate from "@/app/custom-global-components/CustomTablePaginationTemplate/CustomTablePaginationTemplate";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import useDetectMobileViewport from "@/app/hooks/useDetectMobileViewport";
import CustomUserPill from "@/app/custom-global-components/CustomUserPill/CustomUserPill";
import useDateFormat from "@/app/hooks/useDateFormat";
import ModalViewTaskCollaborators from "./components/ModalViewTaskCollaborators";
import ModalViewTaskProgress from "./components/ModalViewTaskProgress";

export default function ProjectsViewTab2({ projectCtrl }: { projectCtrl: ParamValue }) {
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const navigate = useRouter();
    const { getRankAttribute } = useGetRankAttribute();
    const { userData } = useGetCurrentUser();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const { FormatDatetimeToHumanReadable } = useDateFormat();
    const [currentProject, setCurrentProject] = useState<any | null>(null);
    const [projectTasks, setProjectTasks] = useState<any | null>([]);
    const [mode, setMode] = useState<'tasks' | 'applied'>('tasks');
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(12);
    const isMobileViewPort = useDetectMobileViewport();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const GetProjectTasks = async (isInitialLoad: boolean, currentMode: string = 'tasks') => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('csrf-token');

            const link = currentMode === 'tasks'
                ? 'member/projects/get_assigned_projects/get_project_available_tasks'
                : 'member/projects/get_assigned_projects/get_applied_tasks';

            const response = await axios.post(`${urlWithApi}/${link}`, {
                projectCtrl: projectCtrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProjectTasks(response.data.availableTasks);
            setCurrentProject(response.data.project);
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

    const ApplyToATask = async (taskId: string) => {
        const ask = window.confirm("Are you sure you want to apply on this task?");
        if (!ask) return;

        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('taskId', taskId);

            const response = await axios.post(`${urlWithApi}/member/projects/get_assigned_projects/apply_to_a_task`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert(response.data.message);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 500) {
                    alert(error.response?.data.message);
                } else {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsSubmitting(false);
            GetProjectTasks(false, mode);
        }
    }

    const CancelApplication = async (taskId: string) => {
        const ask = window.confirm("Are you sure you want to cancel your task application?");
        if (!ask) return;

        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('taskId', taskId);

            const response = await axios.post(`${urlWithApi}/member/projects/get_assigned_projects/cancel_application`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert(response.data.message);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 500) {
                    alert(error.response?.data.message);
                } else {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsSubmitting(false);
            GetProjectTasks(false, mode);
        }
    }

    useEffect(() => {
        if (userData) {
            GetProjectTasks(true);
            return () => { };
        }
    }, [projectCtrl, userData]);

    const filterTasks = useMemo(() => {
        let result = Array.isArray(projectTasks) ? projectTasks : [];

        if (searchText.trim()) {
            result = result.filter(friend =>
                String(friend?.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(friend?.description || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(friend?.ctrl || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(friend?.status || '').toLowerCase().includes(searchText.toLowerCase())
            );
        }

        return result;
    }, [projectTasks, searchText]);

    const handleModeChange = (mode: 'tasks' | 'applied') => {
        setMode(mode);
        GetProjectTasks(true, mode);
    }

    return (
        <>
            {
                isFetching
                    ? <div className="px-3 py-4">Please wait...</div>
                    : <>
                        {
                            modalOpenIndex === 0 &&
                            <ModalViewTaskCollaborators
                                data={modalOpenData}
                                id={modalOpenId}
                                titleHeader={'View Task Collaborator'}
                                httpMethod={'POST'}
                                callbackFunction={() => {
                                    GetProjectTasks(false, mode);
                                    setModalOpenData(null);
                                    setModalOpenId(null);
                                    setModalOpenIndex(null);
                                }}
                            />
                        }


                        {
                            modalOpenIndex === 1 &&
                            <ModalViewTaskProgress
                                data={modalOpenData}
                                id={modalOpenId}
                                titleHeader={'View Task Progress'}
                                httpMethod={'POST'}
                                callbackFunction={() => {
                                    GetProjectTasks(false, mode);
                                    setModalOpenData(null);
                                    setModalOpenId(null);
                                    setModalOpenIndex(null);
                                }}
                            />
                        }

                        <div className="custom-bottom-border-dark d-flex align-items-center px-4 py-2">
                            <button onClick={() => handleModeChange('tasks')} style={{ height: '40px' }} className={`${mode === 'tasks' ? 'px-3 rpg-button' : 'nav-link-orbit bg-dark custom-border-dark'} mr-1`}>Available</button>
                            <button onClick={() => handleModeChange('applied')} style={{ height: '40px' }} className={`${mode === 'applied' ? 'px-3 rpg-button' : 'nav-link-orbit bg-dark custom-border-dark'}`}>Applied Tasks</button>
                        </div>

                        <div className="px-3 pb-4 pt-3 bg-dark">
                            <FormControl fullWidth sx={{ mb: 1 }}>
                                <Input
                                    id="email"
                                    type="email"
                                    className='custom-field-bg'
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    disableUnderline
                                    size="small"
                                    autoComplete='off'
                                    placeholder='Search task...'
                                />
                            </FormControl>

                            {
                                filterTasks.slice((page * rowsPerPage), ((page * rowsPerPage) + rowsPerPage)).map((taskOverview: any, index: number) => (
                                    <div className={`${taskOverview.members[0]?.status === "CANCELLED" && mode === 'applied' ? 'bg-muted text-muted' : 'custom-bg'} custom-border-dark px-5 pb-5 mb-2 text-white`} key={index} style={{ userSelect: 'none' }}>
                                        <div className="pt-2 text-right d-flex align-items-center justify-content-end">
                                            {
                                                (mode === 'applied' && ["PENDING", "CANCELLED", "TERMINATED"].includes(taskOverview.members[0]?.status)) && <>
                                                    <button onClick={() => CancelApplication(taskOverview.id)} disabled={isSubmitting || ["CANCELLED", "TERMINATED"].includes(taskOverview.members[0]?.status)} className="btn btn-danger custom-bg-maroon elevation-1 btn-sm custom-border-dark rounded-sm text-white">
                                                        {
                                                            taskOverview.members[0]?.status === "PENDING" ? 'Cancel Application' : 'Closed Task'
                                                        }
                                                    </button>
                                                </>
                                            }

                                            {
                                                (taskOverview.members.length <= 0 && !['CLOSED', 'COMPLETED'].includes(taskOverview.status)) && <div className="">
                                                    <button disabled={isSubmitting} onClick={() => ApplyToATask(taskOverview.id)} style={{ height: '40px' }} className="rpg-button px-3">Apply on this task</button>
                                                </div>
                                            }

                                            {
                                                ["ACTIVE"].includes(taskOverview.members[0]?.status) && <>
                                                    <Tooltip title="View Task Progress">
                                                        <IconButton className="ml-2" onClick={() => {
                                                            setModalOpenData({
                                                                taskCtrl: taskOverview?.ctrl
                                                            });
                                                            setModalOpenId(taskOverview?.id);
                                                            setModalOpenIndex(1);
                                                        }} data-target={`#view_task_progress_${taskOverview?.id}`} data-toggle="modal">
                                                            <span className="material-icons-outlined">launch</span>
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            }

                                            <Tooltip title="View Task Collaborators">
                                                <IconButton className="ml-2" onClick={() => {
                                                    setModalOpenData({
                                                        taskCtrl: taskOverview?.ctrl
                                                    });
                                                    setModalOpenId(taskOverview?.id);
                                                    setModalOpenIndex(0);
                                                }} data-target={`#view_task_collaborators_${taskOverview?.id}`} data-toggle="modal">
                                                    <span className="material-icons-outlined">groups</span>
                                                </IconButton>
                                            </Tooltip>
                                        </div>

                                        <hr className="style-two" />

                                        <div className={`mb-2 ${(!["PENDING", "CANCELLED"].includes(taskOverview.members[0]?.status) || mode === 'tasks') && 'mt-4'}`}>
                                            <div className="row">
                                                <div className="col-xl-9 mb-2">
                                                    <h1 className="text-white font-bold text-break text-3xl mb-1">
                                                        {taskOverview.name}
                                                    </h1>
                                                    <div className="text-sm text-muted opacity-60">
                                                        Task Ref: <span className="text-red-500 font-mono">{taskOverview.ctrl}</span>
                                                    </div>
                                                </div>

                                                <div className="col-xl-3 mb-2">
                                                    <Box component="section" className="text-center" sx={{ p: 2, border: '1px dashed grey', background: ['PENDING', 'IN PROGRESS'].includes(taskOverview.status) ? 'rgba(250, 212, 0, 0.08)' : 'rgba(0, 250, 0, 0.08)' }}>
                                                        {taskOverview.status}
                                                    </Box>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className="bg-dark custom-border-dark px-6 quill-content px-4 pt-3 mt-3"
                                            dangerouslySetInnerHTML={{ __html: taskOverview.description }}
                                        />

                                        <div className="bg-dark custom-border-dark mb-3 mt-2">
                                            <div className="row">
                                                <div className="col-6 p-4 text-center">
                                                    <h5 className="text-bold text-muted">Completion Points</h5>
                                                    <div className="h3">+{taskOverview.task_completion_points}</div>
                                                </div>
                                                <div className="col-6 p-4 custom-left-border-dark text-center">
                                                    <h5 className="text-bold text-muted">Progress Points</h5>
                                                    <div className="h3">+{taskOverview.task_progress_points}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-sm text-muted">
                                            <div className="row mb-3">
                                                <div className="col-xl-3 pr-5">
                                                    <div className="pr-5">
                                                        <div className="mb-3">Creator</div>
                                                        <CustomUserPill user={taskOverview.creator} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                Created at {FormatDatetimeToHumanReadable(taskOverview.created_at, true)}
                                            </div>
                                            <div>
                                                Updated at {FormatDatetimeToHumanReadable(taskOverview.updated_at, true)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                            <TablePaginationTemplate
                                dataset={filterTasks}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[12, 24, 36, 50]}
                                page={page}
                                labelRowsPerPage={"Tasks per page:"}
                                callbackFunction={(e) => {
                                    setRowsPerPage(e.rows);
                                    setPage(e.page);
                                }}

                            />
                        </div>
                    </>
            }
        </>
    );
}