import useDateFormat from "@/app/hooks/useDateFormat";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import axios from "axios";
import { ParamValue } from "next/dist/server/request/params";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DropdownMenu from "@/app/custom-global-components/DropdownMenu/DropdowMenu";
import OrbitDatatable from "@/app/custom-global-components/OrbitDatatable/OrbitDatatable";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";
import ModalSubmitTodaysDocumentation from "./components/ModalSubmitTodaysDocumentation";
import ModalViewTodaysDocumentation from "./components/ModalViewTodaysDocumentation";

export default function ViewTaskTab4({ projectCtrl, taskCtrl }: { projectCtrl: ParamValue, taskCtrl: ParamValue }) {
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const [currentTask, setCurrentTask] = useState<any | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [taskPhotoDocumentations, setTaskPhotoDocumentations] = useState<any | null>([]);
    const { FormatDatetimeToHumanReadable } = useDateFormat();
    const { userData } = useGetCurrentUser();

    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetPhotoDocumentations = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('csrf-token');

            const response = await axios.post(`${urlWithApi}/administrator/photo-documentation/photo-documentation/get_photo_documentations`, {
                taskCtrl: taskCtrl
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
        if (taskCtrl) {
            GetPhotoDocumentations(true);
            return () => { };
        }
    }, [projectCtrl, taskCtrl]);

    const tableColumns = [
        {
            name: "Submitted at",
            selector: (row: any) => FormatDatetimeToHumanReadable(row.created_at, false),
            sortable: true
        },
        {
            name: "Upload Count",
            cell: (row: any) => row.uploaded_files_count,
            sortable: true
        },
        {
            name: "Actions",
            cell: (row: any) => {
                const menuItems = [
                    {
                        'icon': 'launch',
                        'url': '#',
                        'data-toggle': 'modal',
                        'data-target': `#view_today_documentation_${row.id}`,
                        'id': 'f',
                        'textColor': '',
                        'label': 'View Uploads',
                        'onClick': () => {
                            setModalOpenData(row);
                            setModalOpenId(row.id);
                            setModalOpenIndex(1);
                        }
                    }
                ];

                return <DropdownMenu id={row.id} menuItems={menuItems} />;
            },
            ignoreRowClick: true
        },
    ];

    return (
        <>
            {
                modalOpenIndex === 0 &&
                <ModalSubmitTodaysDocumentation
                    data={modalOpenData}
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
                modalOpenIndex === 1 &&
                <ModalViewTodaysDocumentation
                    data={modalOpenData}
                    id={modalOpenId}
                    titleHeader={"View photo documentation"}
                    callbackFunction={() => {
                        GetPhotoDocumentations(false);
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            {
                !isFetching && <div className="card rounded-0 custom-bg elevation-0 mb-0">
                    {
                        !['COMPLETED'].includes(currentTask?.status) && (currentTask?.creator_id === userData?.id || userData?.role === "SUPERADMIN") &&
                        <div className="card-header pt-1 pb-0 border-0">
                            <div className="d-flex align-items-center justify-content-end">
                                <div>
                                    <Tooltip title="Add today's photo documentation">
                                        <IconButton disabled={['COMPLETED'].includes(currentTask?.status) || (currentTask?.creator_id !== userData?.id && userData?.role !== "SUPERADMIN")} onClick={() => {
                                            setModalOpenData({
                                                taskCtrl: taskCtrl
                                            });
                                            setModalOpenId(0);
                                            setModalOpenIndex(0);
                                        }} data-target={`#submit_today_documentation_0`} data-toggle="modal">
                                            <AddIcon color='error' />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </div>
                            <hr className="style-two" />
                        </div>
                    }
                </div>
            }

            <div className={`px-4 pb-4 ${isFetching || ['COMPLETED'].includes(currentTask?.status) && (currentTask?.creator_id === userData?.id || userData?.role === "SUPERADMIN") ? 'pt-4' : 'pt-0'}`}>
                <OrbitDatatable
                    withExport
                    progressPending={isFetching}
                    columns={tableColumns}
                    data={taskPhotoDocumentations}
                    selectableRows={false}
                    selectedRows={null}
                />
            </div>
        </>
    );
}