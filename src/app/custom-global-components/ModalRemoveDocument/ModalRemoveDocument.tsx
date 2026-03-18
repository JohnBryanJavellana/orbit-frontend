'use client';

import { useState } from "react";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import useWebToken from "@/app/hooks/useWebToken";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingPopup from "../LoadingPopup/LoadingPopup";
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";

interface ModalRemoveDocumentProps {
    apiSrc: string,
    id: number | null,
    message: string
    titleHeader: string,
    callbackFunction: (e: any) => void
}

export default function ModalRemoveDocument({ apiSrc, id, message, titleHeader, callbackFunction }: ModalRemoveDocumentProps) {
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

    const handleClose = () => {
        $(`#remove_document_${id}`).modal('hide');
        callbackFunction(null);
    }

    const RemoveDocument = async () => {
        try {
            setIsProcessing(true);
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const token = getToken('csrf-token');

            const response = await axios.delete(`${urlWithApi}/${apiSrc}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            $(`#remove_document_${id}`).modal('hide');

            setCallbackFunction({
                callbackFunction: () => handleClose()
            });

            setMessageAlert({
                message: response.data.message,
                status: 'SUCCESS'
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 500) {
                    setMessageAlert({
                        message: error.response?.data.message,
                        status: 'ERROR'
                    });
                } else {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <>
            {isProcessing && <LoadingPopup />}
            <MessageAlertPopup />

            <ModalTemplate
                id={`remove_document_${id}`}
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
                        {message}
                    </>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />

                        <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type="button" onClick={() => RemoveDocument()} disabled={isProcessing} className={`btn btn-danger btn-sm elevation-1 btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white`}>
                            Proceed
                        </button>
                    </div>
                }
            />
        </>
    );
}