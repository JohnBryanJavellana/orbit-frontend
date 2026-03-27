import ModalTemplate from "../../ModalTemplate/ModalTemplate";
import ViewUserContent from "./ViewUserContent";

interface ModalViewUserProps {
    user: any,
    callbackFunction?: (e: any) => void
}

export default function ModalViewUser({ user, callbackFunction }: ModalViewUserProps) {
    const handleClose = () => {
        $(`#view_user_details_${user?.id}`).modal('hide');
        callbackFunction?.(null);
    }

    return (
        <>
            <ModalTemplate
                id={`view_user_details_${user?.id}`}
                size={"xl"}
                isModalScrollable={false}
                modalContentClassName="text-white"
                isModalCentered
                bodyClassName="pb-0 bg-dark"
                body={
                    <>
                        <ViewUserContent autoPlayNoteAudio user={user} />
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>
                    </>
                }
            />
        </>
    );
}