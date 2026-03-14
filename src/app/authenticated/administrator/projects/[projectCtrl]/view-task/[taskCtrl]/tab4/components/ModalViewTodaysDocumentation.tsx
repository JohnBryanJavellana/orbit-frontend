'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useDateFormat from "@/app/hooks/useDateFormat";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";

interface ModalViewTodaysDocumentationProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: any) => void
}

export default function ModalViewTodaysDocumentation({ data, id, titleHeader, callbackFunction }: ModalViewTodaysDocumentationProps) {
    const { urlWithoutApi } = useSystemURLCon();
    const { FormatDatetimeToHumanReadable } = useDateFormat();

    const handleClose = () => {
        $(`#view_today_documentation_${id}`).modal('hide');
        callbackFunction(null);
    }

    return (
        <>
            <ModalTemplate
                id={`view_today_documentation_${id}`}
                size={"lg"}
                isModalScrollable={true}
                isModalCentered
                modalContentClassName="text-white bg-dark"
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
                            data.uploaded_files.length > 0
                                ? data.uploaded_files.map((documentation: any, index: number) => (
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
                    </>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>
                    </div>
                }
            />
        </>
    );
}