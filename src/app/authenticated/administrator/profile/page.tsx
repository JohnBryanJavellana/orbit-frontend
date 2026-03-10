'use client';

import ViewUserContent from "@/app/custom-global-components/CustomUserPill/components/ViewUserContent";
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";
import { useEffect, useState } from "react";
import ModalViewAnnouncement from "./components/ModalViewAnnouncement";
import useGetNewAnnouncement from "@/app/hooks/useGetNewAnnouncement";
import useDetectMobileViewport from "@/app/hooks/useDetectMobileViewport";

interface Props { }

export default function AdminDashboard({ }: Props) {
    const { userData } = useGetCurrentUser();
    const { announcement } = useGetNewAnnouncement();
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);
    const [hasShown, setHasShown] = useState(false);
    const isMobileViewport = useDetectMobileViewport();

    useEffect(() => {
        if (announcement && !hasShown) {
            const timer = setTimeout(() => {
                setModalOpenIndex(0);
                $(`#view_announcement_popup_0`).modal('show');
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [announcement, hasShown]);

    return <>
        {
            modalOpenIndex === 0 &&
            <ModalViewAnnouncement data={announcement} id={0} callbackFunction={() => {
                setModalOpenIndex(null);
                setHasShown(true);
            }} />
        }

        {
            !userData
                ? <p>Please wait...</p>
                : <div>
                    <ViewUserContent user={userData} />
                </div>
        }
    </>;
}