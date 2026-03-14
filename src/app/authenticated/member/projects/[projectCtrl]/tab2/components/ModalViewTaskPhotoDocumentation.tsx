'use client';

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useDateFormat from "@/app/hooks/useDateFormat";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import ModalSubmitTodaysDocumentation from "@/app/authenticated/administrator/projects/[projectCtrl]/view-task/[taskCtrl]/tab4/components/ModalSubmitTodaysDocumentation";

interface ModalViewTaskPhotoDocumentationProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalViewTaskPhotoDocumentation({ data, id, titleHeader, httpMethod, callbackFunction }: ModalViewTaskPhotoDocumentationProps) {
    const { FormatDatetimeToHumanReadable } = useDateFormat();
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [currentTask, setCurrentTask] = useState<any | null>(null);
    const [taskPhotoDocumentations, setTaskPhotoDocumentations] = useState<any | null>([]);
    const [expanded, setExpanded] = useState<string | false>(false);
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const GetPhotoDocumentations = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('csrf-token');

            const response = await axios.post(`${urlWithApi}/administrator/photo-documentation/photo-documentation/get_photo_documentations`, {
                taskCtrl: data?.taskCtrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTaskPhotoDocumentations(response.data.documentations);
            setCurrentTask(response.data.task);
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
        if (data) {
            setExpanded(`panel_0`);
            GetPhotoDocumentations(true);
            return () => { };
        }
    }, [data]);

    const handleClose = () => {
        $(`#view_photo_documentation_${id}`).modal('hide');
        callbackFunction(null);
    }

    return (
        <>
            <ModalTemplate
                id={`view_photo_documentation_${id}`}
                size={"lg"}
                isModalScrollable={true}
                modalContentClassName="text-white"
                header={
                    <>
                        <span className="modal-title text-sm w-100 py-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="text-bold">{titleHeader}</div>

                                {
                                    !['COMPLETED'].includes(currentTask?.status) &&
                                    <Tooltip title="Add today's photo documentation">
                                        <IconButton disabled={['COMPLETED'].includes(currentTask?.status)} onClick={() => {
                                            setModalOpenData({
                                                taskCtrl: data?.taskCtrl
                                            });
                                            setModalOpenId(0);
                                            setModalOpenIndex(0);
                                        }} data-target={`#submit_today_documentation_0`} data-toggle="modal">
                                            <AddIcon color='error' />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </div>
                        </span>
                    </>
                }
                bodyClassName="px-4 text-sm bg-dark"
                body={
                    <>
                        {
                            modalOpenIndex === 0 &&
                            <ModalSubmitTodaysDocumentation
                                data={{
                                    ...modalOpenData,
                                    useBgStack: true
                                }}
                                id={modalOpenId}
                                titleHeader={"Add today's photo documentation"}
                                httpMethod={'POST'}
                                callbackFunction={() => {
                                    GetPhotoDocumentations(false);
                                    setModalOpenData(null);
                                    setModalOpenId(null);
                                    setModalOpenIndex(null);
                                }}
                            />
                        }

                        {
                            isFetching
                                ? <p>Please wait..</p>
                                : taskPhotoDocumentations.length > 0
                                    ? taskPhotoDocumentations.map((documentation: any, index: number) => (
                                        <Accordion key={index} defaultExpanded={expanded === `panel_${index}`} expanded={expanded === `panel_${index}`} onChange={handleChange(`panel_${index}`)} className="custom-bg custom-border-dark">
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1-content"
                                                id="panel1-header"
                                            >
                                                <Typography component="span">
                                                    {FormatDatetimeToHumanReadable(documentation.created_at, false)}
                                                </Typography>
                                            </AccordionSummary>

                                            <AccordionDetails className="bg-dark">
                                                {
                                                    documentation.uploaded_files.length > 0
                                                        ? documentation.uploaded_files.map((documentation: any, index: number) => (
                                                            <div className="card custom-bg rounded-0 custom-border-dark elevation-1" key={index}>
                                                                <div className="card-body text-center">
                                                                    <img src={`${urlWithoutApi}/documentation-files/${documentation.filename}`} className="img-fluid" />
                                                                </div>
                                                                <div className="card-footer py-1 custom-top-border-dark text-left text-sm text-muted">
                                                                    Uploader: {`${documentation.uploader.first_name} ${documentation.uploader.middle_name} ${documentation.uploader.last_name} ${documentation.uploader.suffix ?? ''}`} • {FormatDatetimeToHumanReadable(documentation.created_at, true)}
                                                                </div>
                                                            </div>
                                                        ))
                                                        : <p>No data found..</p>
                                                }
                                            </AccordionDetails>
                                        </Accordion>
                                    ))
                                    : <p>No Photo documentations submitted.</p>
                        }
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>
                    </>
                }
            />
        </>
    );
}