'use client';

import DropdownMenu from "@/app/custom-global-components/DropdownMenu/DropdowMenu";
import OrbitDatatable from "@/app/custom-global-components/OrbitDatatable/OrbitDatatable";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { Avatar, AvatarGroup, Chip, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import ModalCreateOrUpdateProject from "./components/ModalCreateOrUpdateProject";
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";
import PreloadImage from "@/app/custom-global-components/PreloadImage/PreloadImage";

export default function Projects() {
    const { getToken, removeToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const { userData } = useGetCurrentUser();
    const [projects, setProjects] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);

    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetProjects = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/administrator/projects/get_projects`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProjects(response.data.projects);
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
        },
        {
            name: "Collaborators",
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
                        {row.collaborators && row.collaborators.length > 0 ? (
                            row.collaborators.map((member: any, index: number) => {
                                const name = `${member.user.first_name} ${member.user.last_name}`;

                                const initSource = member.user.custom_avatar.shown_avatar === "MAIN" ? member.user.custom_avatar.profile_picture : member.user.custom_avatar.custom_avatar.filename;
                                const finalUrlSrc = `${urlWithoutApi}/${member.user.custom_avatar.shown_avatar === "MAIN" ? 'user-images' : 'custom-avatar-images'}/${initSource}`;

                                return (
                                    <Tooltip key={index} title={name} arrow>
                                        <PreloadImage
                                            noWrapper={true}
                                            src={finalUrlSrc ? finalUrlSrc : ''}
                                            height={'25'}
                                            width={'25'}
                                            isRounded
                                            avatarAltInside={!finalUrlSrc ? member.user.first_name.charAt(0) : undefined}
                                        />
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
            name: "Task Count",
            selector: (row: any) => row.tasks_count > 0 ? row.tasks_count : <i className="text-muted">-- None --</i>,
            sortable: true,
            width: "230px"
        },
        {
            name: "Status",
            selector: (row: any) => row.status,
            cell: (row: any) => {
                return <span className={`text-bold text-${['OPEN', 'IN PROGRESS'].includes(row.status) ? 'warning' : 'danger'}`}>{row.status}</span>
            },
            sortable: true,
            width: "230px"
        },
        {
            name: "Actions",
            cell: (row: any) => {
                const menuItems = [
                    {
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': '',
                        'data-target': ``,
                        'id': 'f',
                        'textColor': '',
                        'label': 'View Project',
                        'onClick': () => {
                            navigate.push(`/authenticated/administrator/projects/${row.ctrl}`);
                        }
                    }
                ];

                return <DropdownMenu id={row.id} menuItems={menuItems} />;
            },
            ignoreRowClick: true
        },
    ];

    useEffect(() => {
        if (userData) {
            GetProjects(true);
            return () => { };
        }
    }, [userData]);

    return <>
        <div className="card rounded-0 custom-bg custom-border-dark">
            <div className="card-header border-0 pt-1 pb-0">
                <div className="d-flex align-items-center justify-content-between">
                    <div>Projects</div>
                    <div>
                        <Tooltip title="Add project">
                            <IconButton onClick={() => {
                                setModalOpenData(null);
                                setModalOpenId(0);
                                setModalOpenIndex(0);
                            }} data-target={`#create_or_update_project_0`} data-toggle="modal">
                                <AddIcon color='error' />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <hr className="style-two" />
            </div>

            {
                modalOpenIndex === 0 &&
                <ModalCreateOrUpdateProject
                    data={modalOpenData}
                    id={modalOpenId}
                    titleHeader={modalOpenData ? 'Update Project' : 'Create Project'}
                    httpMethod={modalOpenData ? 'UPDATE' : 'POST'}
                    callbackFunction={() => {
                        GetProjects(false);
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            <div className="card-body pt-0 text-sm">
                <OrbitDatatable
                    withExport
                    progressPending={isFetching}
                    columns={tableColumns}
                    data={projects}
                    selectableRows={false}
                    selectedRows={null}
                />
            </div>
        </div>
    </>;
}