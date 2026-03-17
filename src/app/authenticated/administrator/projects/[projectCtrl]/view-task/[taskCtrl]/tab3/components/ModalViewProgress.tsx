'use client';
import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useDateFormat from "@/app/hooks/useDateFormat";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
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
    const { urlWithoutApi } = useSystemURLCon();

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

                        <div className="bg-dark p-4 mt-3">
                            <div dangerouslySetInnerHTML={{ __html: data?.activity }} />

                            {data.progress_attachments.length > 0 && (
                                <div className="d-flex flex-wrap gap-2 mb-2">
                                    {data.progress_attachments?.map((attachment: any, index: number) => {
                                        const isImage = /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(attachment.filename);
                                        const fileUrl = `${urlWithoutApi}/progress-attachments/${attachment.filename}`;

                                        return (
                                            <a
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                key={index}
                                                className="position-relative mr-1 mb-1 elevation-2 custom-border-dark rounded overflow-hidden d-flex align-items-center justify-content-center"
                                                style={{ width: '80px', height: '80px', background: '#2a2a2a' }}
                                            >
                                                {isImage ? (
                                                    <img
                                                        src={fileUrl}
                                                        alt="attachment"
                                                        className="w-100 h-100 object-fit-cover"
                                                    />
                                                ) : (
                                                    <div className="text-center">
                                                        <i className="fas fa-file-alt text-info fa-2x"></i>
                                                        <div style={{ fontSize: '9px', marginTop: '2px' }} className="text-white">
                                                            {attachment.filename.split('.').pop()?.toUpperCase()}
                                                        </div>
                                                    </div>
                                                )}
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

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