'use client';
import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useDateFormat from "@/app/hooks/useDateFormat";
import { Divider } from "@mui/material";

interface ModalViewProgressProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalViewProgress({ data, id, titleHeader, httpMethod, callbackFunction }: ModalViewProgressProps) {
    const { FormatDatetimeToHumanReadable } = useDateFormat();

    const handleClose = () => {
        $(`#task_progress_${id}`).modal('hide');
        callbackFunction(null);
    }

    return (
        <>
            <ModalTemplate
                id={`task_progress_${id}`}
                size={"md"}
                isModalScrollable={false}
                modalContentClassName="text-white"
                header={
                    <>
                        <span className="modal-title text-sm">
                            <strong>{titleHeader}</strong>
                        </span>
                    </>
                }
                bodyClassName="px-4 text-sm"
                body={
                    <>
                        <div className="row py-2">
                            <div className="col-xl-3 text-bold">Submitted at</div>
                            <div className="col-xl-9 text-right">{FormatDatetimeToHumanReadable(data?.created_at, true)}</div>
                        </div>

                        <Divider sx={{ opacity: '0.3' }} />

                        <div className="row py-2">
                            <div className="col-xl-3 text-bold">Updated at</div>
                            <div className="col-xl-9 text-right">{FormatDatetimeToHumanReadable(data?.updated_at, true)}</div>
                        </div>

                        <Divider sx={{ opacity: '0.3' }} />

                        <div className="row py-2">
                            <div className="col-xl-3 text-bold">Status</div>
                            <div className="col-xl-9 text-right">{data?.status}</div>
                        </div>

                        <Divider sx={{ opacity: '0.3' }} />

                        <div className="bg-dark p-4 mt-3" dangerouslySetInnerHTML={{ __html: data?.activity }} />

                        {
                            data.remarks &&
                            <>
                                <div className="d-flex align-items-center">
                                    <img src="/system-images/15d4793a-150f-47e0-9a61-b8d0557d7ae5_removalai_preview.png" height={'20px'} alt="" />
                                    <div className="ml-2 pt-4" dangerouslySetInnerHTML={{ __html: data.remarks }} />
                                </div>
                            </>
                        }
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>
                    </>
                }
            />
        </>
    );
}