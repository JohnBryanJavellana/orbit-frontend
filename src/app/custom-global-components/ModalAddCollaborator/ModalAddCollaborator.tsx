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
import LoadingPopup from "../LoadingPopup/LoadingPopup";
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";

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
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

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
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

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

            $(`#add_collaborator_${id}`).modal('hide');

            setCallbackFunction({
                callbackFunction: () => handleClose()
            });

            setMessageAlert({
                message: response.data.message,
                status: 'SUCCESS'
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 500) {
                    setMessageAlert({
                        message: error.response?.data.message,
                        status: 'ERROR'
                    });
                } else {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        GetFutureCollaborators();
        return () => { };
    }, [src]);

    return (
        <>
            {isSubmitting && <LoadingPopup />}
            <MessageAlertPopup />

            <ModalTemplate
                id={`add_collaborator_${id}`}
                size={collaborator ? "xl" : 'md'}
                isModalScrollable={false}
                modalContentClassName="text-white"
                isModalCentered
                headerClassName="border-0 pb-0"
                header={
                    <div className="w-100">
                        <div className="text-sm text-bold text-center w-100">{titleHeader}</div>
                        <hr className="style-two" />
                    </div>
                }
                bodyClassName="py-0"
                body={
                    <>
                        {
                            isFetching
                                ? <p>Please wait...</p>
                                : <>
                                    <div>
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
                                                        <CustomAvatarWithOnlineBadge
                                                            data={option}
                                                            src={`${urlWithoutApi}/user-images/${option.profile_picture}`}
                                                            isOnline={option.is_online}
                                                            isAdmin={option.role === "SUPERADMIN"}
                                                            srcShown={option.custom_avatar?.shown_avatar}
                                                        />
                                                        <div className="ml-3">{`${option.first_name} ${option.middle_name} ${option.last_name} ${option.suffix ?? ''}`}</div>
                                                    </Box>
                                                );
                                            }}
                                        />
                                    </div>

                                    {
                                        collaboratorData && <div className="mt-3">
                                            <ViewUserContent user={collaboratorData} />
                                        </div>
                                    }
                                </>
                        }
                    </>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />
                        <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type="button" onClick={() => AddFutureCollaborator()} disabled={!collaborator || isFetching} className={`btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white`}>
                            Add
                        </button>
                    </div>
                }
            />
        </>
    );
}