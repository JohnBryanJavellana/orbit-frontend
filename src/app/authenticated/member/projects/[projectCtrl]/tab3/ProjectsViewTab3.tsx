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
import ProfileParchment from "../../../leaderboard/components/ProfileParchment";

export default function ProjectsViewTab3({ projectCtrl }: { projectCtrl: ParamValue }) {
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const navigate = useRouter();
    const { getRankAttribute } = useGetRankAttribute();
    const { userData } = useGetCurrentUser();
    const [isFetching, setIsFetching] = useState<boolean>(true);

    const [currentProject, setCurrentProject] = useState<any | null>(null);
    const [taskCollaborators, setProjectTaskCollaborators] = useState<any | null>([]);

    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(12);
    const isMobileViewPort = useDetectMobileViewport();

    const GetProjectCollaborators = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('csrf-token');

            const response = await axios.post(`${urlWithApi}/administrator/projects/get_projects/get_project_collaborators`, {
                projectCtrl: projectCtrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProjectTaskCollaborators(response.data.members);
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

    useEffect(() => {
        if (userData) {
            GetProjectCollaborators(true);
            return () => { };
        }
    }, [projectCtrl, userData]);

    const filteredCollaborators = useMemo(() => {
        let result = Array.isArray(taskCollaborators) ? taskCollaborators : [];

        if (searchText.trim()) {
            result = result.filter(friend =>
                String(friend?.user.first_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(friend?.user.middle_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(friend?.user.last_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(friend?.user.suffix || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(friend?.user.email || '').toLowerCase().includes(searchText.toLowerCase())
            );
        }

        return result;
    }, [taskCollaborators, searchText]);


    return (
        <>
            {
                isFetching
                    ? <p>Please wait...</p>
                    : <>

                        {
                            modalOpenIndex === 1 &&
                            <ModalViewUser
                                user={modalOpenData}
                                callbackFunction={() => {
                                    GetProjectCollaborators(false);
                                    setModalOpenData(null);
                                    setModalOpenId(null);
                                    setModalOpenIndex(null);
                                }}
                            />
                        }

                        {
                            taskCollaborators.length > 0
                                ? <div className="mb-2">
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
                                            placeholder='Search friend...'
                                        />
                                    </FormControl>

                                    {
                                        filteredCollaborators.slice((page * rowsPerPage), ((page * rowsPerPage) + rowsPerPage)).map((friend: any, index: number) => (
                                            <div key={index} className="my-2">
                                                <ProfileParchment user={friend.user} callbackFunction={(e) => GetProjectCollaborators(e)} />
                                            </div>
                                        ))
                                    }

                                    <TablePaginationTemplate
                                        dataset={filteredCollaborators}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={[12, 24, 36, 50]}
                                        page={page}
                                        labelRowsPerPage={"Collaborators per page:"}
                                        callbackFunction={(e) => {
                                            setRowsPerPage(e.rows);
                                            setPage(e.page);
                                        }}

                                    />
                                </div> : <p>Project do not have collaborators yet.</p>
                        }
                    </>
            }
        </>
    );
}