'use client';

import TablePaginationTemplate from "@/app/custom-global-components/CustomTablePaginationTemplate/CustomTablePaginationTemplate";
import CustomUserPill from "@/app/custom-global-components/CustomUserPill/CustomUserPill";
import useDetectMobileViewport from "@/app/hooks/useDetectMobileViewport";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { Box, FormControl, Input, Tooltip } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface ProjectsProp { }

export default function Projects({ }: ProjectsProp) {
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const [assignedProjects, setAssignedProjects] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>('');
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);
    const isMobileViewPort = useDetectMobileViewport();

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(12);

    const GetAssignedProjects = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/member/projects/get_assigned_projects`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setAssignedProjects(response.data.projects);
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
        GetAssignedProjects(true);
        return () => { };
    }, []);

    const filteredProjects = useMemo(() => {
        let result = Array.isArray(assignedProjects) ? assignedProjects : [];

        if (searchText.trim()) {
            result = result.filter(friend =>
                (friend?.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                (friend?.status || '').toLowerCase().includes(searchText.toLowerCase()) ||
                (friend?.ctrl || '').toLowerCase().includes(searchText.toLowerCase())
            );
        }

        return result;
    }, [assignedProjects, searchText]);

    return (
        <>
            {
                isFetching
                    ? <p>Please wait...</p>
                    : <>
                        {
                            assignedProjects.length > 0
                                ? <div className="mb-5">
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
                                            placeholder='Search project...'
                                        />
                                    </FormControl>

                                    {
                                        filteredProjects.slice((page * rowsPerPage), ((page * rowsPerPage) + rowsPerPage)).map((project: any, index: number) => (
                                            <div key={index} className="row px-2 my-2">
                                                <div className="col-xl-12 py-1 custom-bg custom-border-dark">
                                                    <div className="row px-3 pt-4 pb-3">
                                                        <div className="col-xl-10 mb-2">
                                                            <div className="h2 text-bold">
                                                                {project.name}
                                                                <Link href={`/authenticated/member/projects/${project.ctrl}`}>
                                                                    <Tooltip title="View Project">
                                                                        <span className="material-icons-outlined ml-3 text-muted">launch</span>
                                                                    </Tooltip>
                                                                </Link>
                                                            </div>
                                                            <div className="text-muted text-sm">{project.ctrl}</div>

                                                            <div className="row mt-3">
                                                                <div className="col-xl-3 pr-5">
                                                                    <div className="text-sm text-muted mb-3">Creator</div>
                                                                    <CustomUserPill user={project.creator} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-2 text-center">
                                                            <Box component="section" className="text-center" sx={{ p: 1, border: '1px dashed grey', background: ['IN PROGRESS', 'OPEN', 'COMPLETED'].includes(project.status) ? 'rgba(0, 250, 0, 0.08)' : 'rgba(250, 0, 0, 0.08)' }}>
                                                                {project.status}
                                                            </Box>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }

                                    <TablePaginationTemplate
                                        dataset={assignedProjects}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={[12, 24, 36, 50]}
                                        page={page}
                                        labelRowsPerPage={"Projects per page:"}
                                        callbackFunction={(e) => {
                                            setRowsPerPage(e.rows);
                                            setPage(e.page);
                                        }}

                                    />
                                </div> : <p>You do not have any assigned projects.</p>
                        }
                    </>
            }
        </>
    );
}