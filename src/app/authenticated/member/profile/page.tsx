'use client';

import ViewUserContent from "@/app/custom-global-components/CustomUserPill/components/ViewUserContent";
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";

interface Props { }

export default function Dashboard({ }: Props) {
    const { userData } = useGetCurrentUser();

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