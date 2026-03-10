'use client';

import ViewUserContent from "@/app/custom-global-components/CustomUserPill/components/ViewUserContent";
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";
import useGetRankAttribute2 from "@/app/hooks/useGetRankAttribute2";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import { useEffect, useState } from "react";
import ModalViewAnnouncement from "./components/ModalViewAnnouncement";
import useGetNewAnnouncement from "@/app/hooks/useGetNewAnnouncement";

interface Props { }

export default function Dashboard({ }: Props) {
    const { userData } = useGetCurrentUser();
    const { announcement } = useGetNewAnnouncement();

    useEffect(() => {
        if (announcement) {
            const timer = setTimeout(() => {
                $('#view_announcement_popup_0').modal('show');
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [announcement]);

    return <>
        <ModalViewAnnouncement data={announcement} id={0} />

        {
            !userData
                ? <p>Please wait...</p>
                : <>
                    <ViewUserContent user={userData} />
                </>
        }
    </>;
}