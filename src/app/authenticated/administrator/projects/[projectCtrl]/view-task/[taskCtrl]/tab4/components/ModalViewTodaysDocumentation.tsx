'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";

interface ModalViewTodaysDocumentationProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: any) => void
}

export default function ModalViewTodaysDocumentation({ data, id, titleHeader, callbackFunction }: ModalViewTodaysDocumentationProps) {
    const { urlWithoutApi } = useSystemURLCon();

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
                modalContentClassName="text-white bg-dark"
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
                            data.length > 0
                                ? data.map((documentation: any, index: number) => (
                                    <div className="card custom-bg rounded-0 custom-border-dark elevation-1" key={index}>
                                        <div className="card-body text-center">
                                            <img src={`${urlWithoutApi}/documentation-files/${documentation.filename}`} className="img-fluid" />
                                        </div>
                                    </div>
                                ))
                                : <p>No data found..</p>
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