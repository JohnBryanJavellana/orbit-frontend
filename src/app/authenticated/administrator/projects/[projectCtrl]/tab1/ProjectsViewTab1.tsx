import useDateFormat from "@/app/hooks/useDateFormat";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { Box, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import { ParamValue } from "next/dist/server/request/params";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ModalCreateOrUpdateProject from "../../components/ModalCreateOrUpdateProject";
import CustomUserPill from "@/app/custom-global-components/CustomUserPill/CustomUserPill";
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";

export default function ProjectsViewTab1({ projectCtrl, isFromNonAdmin = false }: { projectCtrl: ParamValue, isFromNonAdmin?: boolean }) {
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const { userData } = useGetCurrentUser();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [projectDetails, setProjectDetails] = useState<any | null>(null);
    const { FormatDatetimeToHumanReadable } = useDateFormat();
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetProjectDetails = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('csrf-token');

            const response = await axios.post(`${urlWithApi}/administrator/projects/get_projects`, {
                projectCtrl: projectCtrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProjectDetails(response.data.projects);
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
            GetProjectDetails(true);
            return () => { };
        }
    }, [projectCtrl, userData]);

    return (
        <>
            {
                isFetching
                    ? <div className="p-4">Loading ....</div>
                    : <>
                        {
                            modalOpenIndex === 0 &&
                            <ModalCreateOrUpdateProject
                                data={modalOpenData}
                                id={modalOpenId}
                                titleHeader={'Update Project'}
                                httpMethod={'UPDATE'}
                                callbackFunction={() => {
                                    GetProjectDetails(false);
                                    setModalOpenData(null);
                                    setModalOpenId(null);
                                    setModalOpenIndex(null);
                                }}
                            />
                        }

                        <div className="card rounded-0 custom-bg elevation-0 mb-0" style={{ userSelect: 'none' }}>
                            {
                                (projectDetails?.creator_id === userData?.id || userData?.role === "SUPERADMIN") &&
                                <div className="card-header custom-bottom-border-dark py-1">
                                    <div className="d-flex align-items-center justify-content-end">
                                        <div>
                                            <Tooltip title="Edit project">
                                                <IconButton disabled={projectDetails?.creator_id !== userData?.id && userData?.role !== "SUPERADMIN"} onClick={() => {
                                                    setModalOpenData({
                                                        ...projectDetails,
                                                        projectCtrl: projectCtrl,
                                                        trueData: true
                                                    });
                                                    setModalOpenId(projectDetails?.id);
                                                    setModalOpenIndex(0);
                                                }} data-target={`#create_or_update_project_${projectDetails?.id}`} data-toggle="modal">
                                                    <EditIcon color='error' />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>

                            }

                            <div className="card-body">
                                <div className="p-1 text-white">
                                    <div className="mb-2">
                                        <div className="row">
                                            <div className="col-xl-9 mb-2">
                                                <h1 className="text-white font-bold text-break text-3xl mb-1">
                                                    {projectDetails.name}
                                                </h1>
                                                <div className="text-sm text-muted opacity-60">
                                                    Project Ref: <span className="text-red-500 font-mono">{projectCtrl}</span>
                                                </div>
                                            </div>

                                            <div className="col-xl-3 mb-2">
                                                <Box component="section" className="text-center" sx={{ p: 2, border: '1px dashed grey', background: ['IN PROGRESS', 'OPEN', 'COMPLETED'].includes(projectDetails.status) ? 'rgba(0, 250, 0, 0.08)' : 'rgba(250, 0, 0, 0.08)' }}>
                                                    {projectDetails.status}
                                                </Box>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="bg-dark custom-border-dark px-6 quill-content px-4 pt-3 my-3"
                                        dangerouslySetInnerHTML={{ __html: projectDetails.description }}
                                    />

                                    <div className="bg-dark custom-border-dark mb-3">
                                        <div className="row">
                                            <div className="col-12 p-4 text-center">
                                                <h5 className="text-bold text-muted">Completion Points</h5>
                                                <div className="h3">+{projectDetails.completion_points}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-sm text-muted">
                                        <div className="col-xl-3 pr-5">
                                            <div className="pr-5">
                                                <div className="mb-3">Creator</div>
                                                <CustomUserPill user={projectDetails.creator} />
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            Created at {FormatDatetimeToHumanReadable(projectDetails.created_at, true)}
                                        </div>
                                        <div>
                                            Updated at {FormatDatetimeToHumanReadable(projectDetails.updated_at, true)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </>
    );
}