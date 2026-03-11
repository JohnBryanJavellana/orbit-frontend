'use client';

import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewUserAuraPointsRecordInAdmin({ userId }: { userId: number }) {
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const [records, setRecords] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);

    const GetUserAuraRecord = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/administrator/aura_point_record/aura_point_record/get_aura_point_records`, {
                userId: userId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setRecords(response.data.auraPointsRecord);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 500) {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        GetUserAuraRecord(true);
        return () => { };
    }, [userId]);

    return (
        <div>
            Loading...
        </div>
    );
}