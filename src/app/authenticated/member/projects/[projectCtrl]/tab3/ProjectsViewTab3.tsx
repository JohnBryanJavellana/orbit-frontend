import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import axios from "axios";
import { ParamValue } from "next/dist/server/request/params";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";
import Leaderboard from "../../../leaderboard/page";

export default function ProjectsViewTab3({ projectCtrl }: { projectCtrl: ParamValue }) {
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const { userData } = useGetCurrentUser();
    const [isFetching, setIsFetching] = useState<boolean>(true);

    const [currentProject, setCurrentProject] = useState<any | null>(null);
    const [taskCollaborators, setProjectTaskCollaborators] = useState<any | null>([]);

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

            setProjectTaskCollaborators(response.data.members.map((member: any) => member.user));
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

    return (
        <>
            {
                isFetching
                    ? <p>Please wait...</p>
                    : <Leaderboard providedData={taskCollaborators} tablePaginationText="Collaborators" providedCallbackFunction={() => GetProjectCollaborators(false)} />
            }
        </>
    );
}