'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useDateFormat from "@/app/hooks/useDateFormat";
import 'primereact/resources/themes/lara-dark-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'quill/dist/quill.snow.css';

interface ModalViewAnnouncementProps {
    data: any | null,
    id: number | null,
    callbackFunction: () => void
}

export default function ModalViewAnnouncement({ data, id, callbackFunction }: ModalViewAnnouncementProps) {
    const { FormatDatetimeToHumanReadable } = useDateFormat();

    const handleClose = () => {
        $(`#view_announcement_popup_${id}`).modal('hide');
        callbackFunction();
    }

    return (
        <>
            <ModalTemplate
                id={`view_announcement_popup_${id}`}
                size={"lg"}
                isModalScrollable={false}
                modalContentClassName="text-white"
                isModalCentered
                headerClassName="border-0 pb-0"
                header={
                    <div className="w-100">
                        <div className="text-sm text-bold text-center w-100">Announcement</div>
                        <hr className="style-two" />
                    </div>
                }
                bodyClassName="px-3 text-sm pt-2 pb-0"
                body={
                    <div style={{ userSelect: 'none' }}>
                        {
                            data?.map((a: any, index: number) => (
                                <div key={index} className="card custom-border-dark custom-bg rounded-0">
                                    <div className="card-body ql-snow">
                                        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: a.content }} />
                                    </div>

                                    <div className="card-footer custom-top-border-dark py-1">
                                        <div className="text-muted text-sm">{FormatDatetimeToHumanReadable(a.created_at, true)}</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />
                        <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>
                    </div>
                }
            />
        </>
    );
}