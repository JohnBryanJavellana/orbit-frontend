'use client';

import { useState } from "react";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import useWebToken from "@/app/hooks/useWebToken";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingPopup from "../LoadingPopup/LoadingPopup";

interface ModalUserLogoutProps {
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: any) => void
}

export default function ModalUserLogout({ id, titleHeader, callbackFunction }: ModalUserLogoutProps) {
    const { urlWithApi } = useSystemURLCon();
    const { getToken, removeToken } = useWebToken();
    const navigate = useRouter();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const LogoutUser = async () => {
        try {
            setIsProcessing(true);

            const token = getToken('csrf-token');
            await axios.get(`${urlWithApi}/logout-user`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 500) {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsProcessing(false);
            $(`#logout_user_${id}`).modal('hide');

            removeToken('csrf-token');
            removeToken('role-access');
            navigate.push('/');
        }
    }

    const handleClose = () => {
        $(`#logout_user_${id}`).modal('hide');
        callbackFunction(null);
    }

    return (
        <>
            {isProcessing && <LoadingPopup />}

            <ModalTemplate
                id={`logout_user_${id}`}
                size="md"
                isModalScrollable={false}
                isModalCentered
                modalParentStyle="bg-stack"
                modalContentClassName="text-white"
                bodyClassName="pb-2 text-center text-sm"
                headerClassName="border-0 pb-0"
                header={
                    <div className="w-100">
                        <div className="text-sm text-bold text-center w-100">{titleHeader}</div>
                        <hr className="style-two" />
                    </div>
                }
                body={
                    <>
                        Are you sure you want to logout?
                    </>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />

                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type="button" onClick={() => LogoutUser()} disabled={isProcessing} className={`btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white`}>
                            Proceed
                        </button>
                    </div>
                }
            />
        </>
    );
}