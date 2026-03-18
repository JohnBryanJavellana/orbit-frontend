import { useEffect, useState } from "react";
import ModalTemplate from "../custom-global-components/ModalTemplate/ModalTemplate";

interface MessageAlertProps {
    message: string | null,
    status: 'SUCCESS' | 'ERROR' | null
}

interface MessageAlertCallbackFunctionProps {
    callbackFunction: () => void
}

export default function useMessageAlertPopup() {
    const [messageAlert, setMessageAlert] = useState<MessageAlertProps | null>(null);
    const [callbackFunction, setCallbackFunction] = useState<MessageAlertCallbackFunctionProps | null>(null);

    const handleClose = () => {
        $(`#message_alert_popup`).modal('hide');
        callbackFunction?.callbackFunction();
    }

    useEffect(() => {
        if (messageAlert?.message) {
            $(`#message_alert_popup`).modal('show');
        }
    }, [messageAlert]);

    const MessageAlertPopup = () => {
        return (
            <ModalTemplate
                id={`message_alert_popup`}
                size="md"
                isModalScrollable={false}
                isModalCentered
                modalParentStyle="bg-stack"
                modalContentClassName="text-white"
                bodyClassName="pb-2 text-center text-sm"
                headerClassName="border-0 pb-0"
                header={
                    <div className="w-100">
                        <div className="text-sm text-bold text-center w-100">System Alert</div>
                        <hr className="style-two" />
                    </div>
                }
                body={
                    <>
                        {messageAlert?.message}
                    </>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />

                        <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>
                    </div>
                }
            />
        )
    }

    return { messageAlert, setMessageAlert, setCallbackFunction, MessageAlertPopup };
}