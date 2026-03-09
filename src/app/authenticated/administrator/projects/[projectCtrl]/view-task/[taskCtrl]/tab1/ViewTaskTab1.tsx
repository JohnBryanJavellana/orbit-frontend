import useDateFormat from "@/app/hooks/useDateFormat";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { Box, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { ParamValue } from "next/dist/server/request/params";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import ModalCreateOrUpdateTask from "../../../tab2/components/ModalCreateOrUpdateTask";
import CustomUserPill from "@/app/custom-global-components/CustomUserPill/CustomUserPill";
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";

export default function ViewTaskTab1({ projectCtrl, taskCtrl }: { projectCtrl: ParamValue, taskCtrl: ParamValue }) {
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const { userData } = useGetCurrentUser();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [taskOverview, setProjectTaskOverview] = useState<any | null>(null);
    const { FormatDatetimeToHumanReadable } = useDateFormat();
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetSpecificTask = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('csrf-token');

            const response = await axios.post(`${urlWithApi}/administrator/projects/get_projects/get_project_tasks`, {
                projectCtrl: projectCtrl,
                taskCtrl: taskCtrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProjectTaskOverview(response.data.tasks);
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
            GetSpecificTask(true);
            return () => { };
        }
    }, [projectCtrl, taskCtrl, userData]);

    return (
        <>
            {
                modalOpenIndex === 0 &&
                <ModalCreateOrUpdateTask
                    data={modalOpenData}
                    id={modalOpenId}
                    titleHeader={'Update Task'}
                    httpMethod={'UPDATE'}
                    callbackFunction={() => {
                        GetSpecificTask(false);
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
                        <div className="card-header custom-bottom-border-dark py-1">
                            <div className="d-flex align-items-center justify-content-end">
                                <div>
                                    <Tooltip title="Edit task">
                                        <IconButton disabled={['COMPLETED', 'IN PROGRESS'].includes(taskOverview?.status) || (taskOverview?.creator_id !== userData?.id && userData?.role !== "SUPERADMIN")} onClick={() => {
                                            setModalOpenData({
                                                ...taskOverview,
                                                projectCtrl: projectCtrl,
                                                trueData: true
                                            });
                                            setModalOpenId(taskOverview?.id);
                                            setModalOpenIndex(0);
                                        }} data-target={`#task_${taskOverview?.id}`} data-toggle="modal">
                                            <EditIcon color='error' />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="p-1 text-white">
                                <div className="mb-2">
                                    <div className="row">
                                        <div className="col-xl-9 mb-2">
                                            <h1 className="text-white font-bold text-break text-3xl mb-1">
                                                {taskOverview.name}
                                            </h1>
                                            <div className="text-sm text-muted opacity-60">
                                                Task Ref: <span className="text-red-500 font-mono">{taskCtrl}</span>
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
                                        <div className="col-xl-2">
                                            <div>
                                                Creator
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
                        </div>
                    </div>
            }
        </>
    );
}