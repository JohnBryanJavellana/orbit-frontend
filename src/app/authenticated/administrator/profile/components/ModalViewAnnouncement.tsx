'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import './ModalViewAnnouncement.css';
import useDateFormat from "@/app/hooks/useDateFormat";

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
                modalDialogStyle="parchment bg-transparent"
                isModalScrollable={false}
                bodyClassName="mx-5"
                modalContentClassName="bg-transparent border-0 elevation-0 shadow-0"
                body={
                    <div style={{ userSelect: 'none' }}>
                        <div className="parchment-content">
                            <div className="text-dark text-bold h2 text-center mb-5">Announcement</div>

                            {
                                data?.map((a: any, index: number) => (
                                    <div key={index}>
                                        <div className="text-dark mb-2" dangerouslySetInnerHTML={{ __html: a.content }} />

                                        <div className="mt-1 text-muted text-sm">{FormatDatetimeToHumanReadable(a.created_at, true)}</div>
                                        {index < data?.length - 1 && <hr className="style-two" />}
                                    </div>
                                ))
                            }

                            <div className="d-flex align-items-center justify-content-center mt-4">
                                <button type="button" onClick={() => handleClose()} className="rpg-button px-4 shadow">
                                    CLOSE
                                </button>
                            </div>
                        </div>
                    </div>
                }
            />
        </>
    );
}