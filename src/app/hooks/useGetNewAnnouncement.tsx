'use client';

import { useCallback, useEffect, useState } from 'react';
import useWebToken from './useWebToken';
import useSystemURLCon from './useSystemURLCon';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function useGetNewAnnouncement() {
    const { getToken, removeToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const [announcement, setAnnouncement] = useState<any>(null);
    const navigate = useRouter();

    const GetNewAnnouncement = useCallback(async () => {
        try {
            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/administrator/announcement/get_announcements/get_announcements`, {
                getNew: true
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setAnnouncement(response.data.announcements);
        } catch (error) {
            removeToken('csrf-token');
            navigate.push('/access-denied');
        }
    }, [urlWithApi, getToken]);

    useEffect(() => {
        GetNewAnnouncement();
    }, []);

    return { announcement, refreshAnnouncement: GetNewAnnouncement };
}