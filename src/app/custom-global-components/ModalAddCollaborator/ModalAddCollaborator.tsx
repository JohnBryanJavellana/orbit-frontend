'use client';

import { useEffect, useState } from "react";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import ViewUserContent from "../CustomUserPill/components/ViewUserContent";
import useWebToken from "@/app/hooks/useWebToken";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Autocomplete, Box, TextField } from "@mui/material";
import CustomAvatarWithOnlineBadge from "../CustomAvatarWithOnlineBadge/CustomAvatarWithOnlineBadge";

interface ModalAddCollaboratorProps {
    data: any | null,
    src: string,
    type: 'MAIN_PROJECT' | 'MAIN_TASK',
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalAddCollaborator({ data, src, type, id, titleHeader, httpMethod, callbackFunction }: ModalAddCollaboratorProps) {
    const [collaborators, setCollaborators] = useState<any | null>([]);
    const [collaborator, setCollaborator] = useState<any | null>(null);
    const [collaboratorData, setCollaboratorData] = useState<any | null>(null);
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleClose = () => {
        $(`#add_collaborator_${id}`).modal('hide');
        callbackFunction(null);
    }

    const GetFutureCollaborators = async () => {
        try {
            setIsFetching(true);
            const token = getToken('csrf-token');

            const response = await axios.post(`${urlWithApi}/${src}`, {
                type: type,
                projectCtrl: type === "MAIN_TASK" ? data?.projectCtrl : null
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCollaborators(response.data.future_collaborators);
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

    const AddFutureCollaborator = async () => {
        try {
            setIsSubmitting(true);
            const token = getToken('csrf-token');

            const apiSrc = type === "MAIN_PROJECT"
                ? `${urlWithApi}/administrator/projects/get_projects/assign_user_as_project_collaborator`
                : `${urlWithApi}/administrator/projects/get_projects/get_project_tasks/assign_user_as_task_collaborator`;

            const payload = type === "MAIN_PROJECT"
                ? {
                    projectCtrl: data?.projectCtrl,
                    collaboratorId: collaborator
                } : {
                    taskCtrl: data?.taskCtrl,
                    memberId: collaborator,
                    memberRoleId: null
                };

            const response = await axios.post(apiSrc, payload, {
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
            handleClose();
        }
    }

    useEffect(() => {
        GetFutureCollaborators();
        return () => { };
    }, [src]);

    return (
        <>
            <ModalTemplate
                id={`add_collaborator_${id}`}
                size={collaborator ? "xl" : 'md'}
                isModalScrollable={false}
                modalContentClassName="text-white"
                bodyClassName="pb-2"
                header={
                    <>
                        <span className="modal-title text-sm">
                            <strong>{titleHeader}</strong>
                        </span>
                    </>
                }
                body={
                    <>
                        {
                            isFetching
                                ? <p>Please wait...</p>
                                : <>
                                    <div className="mb-2">
                                        <Autocomplete
                                            disablePortal
                                            options={collaborators}
                                            value={collaborators.find((g: any) => g.id === collaborator) || null}
                                            getOptionLabel={(option) => `${option.first_name} ${option.middle_name} ${option.last_name} ${option.suffix ?? ''}`}
                                            onChange={(e, value) => {
                                                setCollaborator(value ? value.id : '');
                                                setCollaboratorData(value ? value : null);
                                            }}
                                            fullWidth
                                            renderInput={(params) => <TextField {...params} label="Collaborator" />}
                                            renderOption={(props, option) => {
                                                const { key, ...optionProps } = props;
                                                return (
                                                    <Box
                                                        key={key}
                                                        component="li"
                                                        sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                                        {...optionProps}
                                                    >
                                                        <CustomAvatarWithOnlineBadge height={30} width={30} src={`${urlWithoutApi}/user-images/${option.profile_picture}`} srcShown={option} />
                                                        <div className="ml-3">{`${option.first_name} ${option.middle_name} ${option.last_name} ${option.suffix ?? ''}`}</div>
                                                    </Box>
                                                );
                                            }}
                                        />
                                    </div>

                                    {
                                        collaboratorData && <ViewUserContent user={collaboratorData} />
                                    }
                                </>
                        }
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type="button" onClick={() => AddFutureCollaborator()} disabled={!collaborator || isFetching} className={`btn btn-danger btn-sm elevation-1`}>
                            Add
                        </button>
                    </>
                }
            />
        </>
    );
}