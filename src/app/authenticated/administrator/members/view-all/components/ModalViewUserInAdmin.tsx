'use client';
import CustomTab from "@/app/custom-global-components/CustomTab/CustomTab";
import ViewUserContent from "@/app/custom-global-components/CustomUserPill/components/ViewUserContent";
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import { useState } from "react";
import ViewUserRareBordersInAdmin from "./ViewUserRareBordersInAdmin";
import ViewUserAuraPointsRecordInAdmin from "./ViewUserAuraPointsRecordInAdmin copy";

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
                        <CustomTab
                            tabId={tabId}
                            tabs={(() => {
                                const menuItems = [
                                    {
                                        icon: "info",
                                        label: "Member Details",
                                        index: 0
                                    },
                                    {
                                        icon: "account_circle",
                                        label: "Rare Borders Inventory",
                                        index: 1
                                    }
                                ];

                                if (data?.role === "MEMBER") {
                                    menuItems.push({
                                        icon: "insights",
                                        label: "Aura Points Record",
                                        index: 2
                                    });
                                }

                                return menuItems;
                            })()}
                            callbackFunction={(e) => setTabId(e)}
                        />

                        <div className="card rounded-0 bg-transparent elevation-0">
                            <div className="card-body p-0">
                                <div role="tabpanel" hidden={tabId !== 0} id={`simple-tabpanel-0`} aria-labelledby={`simple-tab-0`}>
                                    {(tabId === 0) && <ViewUserContent user={data} />}
                                </div>

                                <div role="tabpanel" className="custom-bg custom-border-dark elevation-1" hidden={tabId !== 1} id={`simple-tabpanel-1`} aria-labelledby={`simple-tab-1`}>
                                    {(tabId === 1) && <ViewUserRareBordersInAdmin userId={data?.id} />}
                                </div>

                                <div role="tabpanel" className="custom-bg custom-border-dark elevation-1" hidden={tabId !== 2} id={`simple-tabpanel-2`} aria-labelledby={`simple-tab-2`}>
                                    {(tabId === 2) && <ViewUserAuraPointsRecordInAdmin userId={data?.id} />}
                                </div>
                            </div>
                        </div>
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