'use client';
import CustomTab from "@/app/custom-global-components/CustomTab/CustomTab";
import ViewUserContent from "@/app/custom-global-components/CustomUserPill/components/ViewUserContent";
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import { useState } from "react";

interface ModalViewUserInAdminProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalViewUserInAdmin({ data, id, titleHeader, httpMethod, callbackFunction }: ModalViewUserInAdminProps) {
    const [tabId, setTabId] = useState<number>(0);

    const handleClose = () => {
        $(`#view_user_in_admin_${id}`).modal('hide');
        callbackFunction(null);
    }

    return (
        <>
            <ModalTemplate
                id={`view_user_in_admin_${id}`}
                size={"xl"}
                isModalScrollable={false}
                modalContentClassName="text-white"
                header={
                    <>
                        <span className="modal-title text-sm">
                            <strong>{titleHeader}</strong>
                        </span>
                    </>
                }
                bodyClassName="p-4 bg-dark"
                body={
                    <>
                        <CustomTab
                            tabId={tabId}
                            tabs={[
                                {
                                    icon: "info",
                                    label: "Member Details",
                                    index: 0
                                },
                                {
                                    icon: "task",
                                    label: "Aura Points Record",
                                    index: 1
                                }
                            ]}
                            callbackFunction={(e) => setTabId(e)}
                        />

                        <div className="card rounded-0 custom-bg custom-border-dark">
                            <div className="card-body p-0">
                                <div role="tabpanel" hidden={tabId !== 0} id={`simple-tabpanel-0`} aria-labelledby={`simple-tab-0`}>
                                    {(tabId === 0) && <ViewUserContent user={data} />}
                                </div>

                                <div role="tabpanel" hidden={tabId !== 1} id={`simple-tabpanel-1`} aria-labelledby={`simple-tab-1`}>
                                    {(tabId === 1) && <p>1111</p>}
                                </div>
                            </div>
                        </div>
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