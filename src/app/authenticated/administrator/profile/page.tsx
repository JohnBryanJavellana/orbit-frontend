'use client';

import CustomAvatarWithOnlineBadge from "@/app/custom-global-components/CustomAvatarWithOnlineBadge/CustomAvatarWithOnlineBadge";
import CustomAvatarWithRankFrame from "@/app/custom-global-components/CustomAvatarWithRankFrame/CustomAvatarWithRankFrame";
import ViewUserContent from "@/app/custom-global-components/CustomUserPill/components/ViewUserContent";
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";
import useGetRankAttribute2 from "@/app/hooks/useGetRankAttribute2";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Typography } from "@mui/material";

interface Props {

}

export default function Dashboard({ }: Props) {
    const { getRankAttribute } = useGetRankAttribute2();
    const { userData } = useGetCurrentUser();
    const { urlWithoutApi } = useSystemURLCon();

    return <>
        {
            !userData
                ? <p>Please wait...</p>
                : <>
                    <ViewUserContent user={userData} />
                </>
        }
    </>;
}