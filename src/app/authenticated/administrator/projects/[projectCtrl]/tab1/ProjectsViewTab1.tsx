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
import ProjectContent from "./ProjectContent";
import ProjectContentSkeleton from "./ProjectContentSkeleton";

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
                    ? <ProjectContentSkeleton />
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

                        <div className="card rounded-0 custom-bg elevation-0 mb-0">
                            {
                                !['ABANDONED', 'COMPLETED'].includes(projectDetails?.status) && (projectDetails?.creator_id === userData?.id || userData?.role === "SUPERADMIN") &&
                                <div className="card-header border-0 py-1 pb-0">
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
                                    <hr className="style-two" />
                                </div>
                            }

                            <ProjectContent projectDetails={projectDetails} projectCtrl={projectCtrl} />
                        </div>
                    </>
            }
        </>
    );
}