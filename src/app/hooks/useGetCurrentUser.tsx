import { useCallback, useEffect, useState } from "react";
import useWebToken from "./useWebToken";
import useSystemURLCon from "./useSystemURLCon";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function useGetCurrentUser() {
    const [userData, setUserData] = useState<any | null>(null);
    const { getToken, removeToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();

    const GetCurrentUser = useCallback(async () => {
        try {
            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/user`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUserData(response.data.user);
            return response.data.user;
        } catch (error) {
            removeToken('csrf-token');
            navigate.push('/access-denied');
        }
    }, [userData]);

    useEffect(() => {
        GetCurrentUser();
    }, []);

    return { userData, refreshUser: GetCurrentUser };
}