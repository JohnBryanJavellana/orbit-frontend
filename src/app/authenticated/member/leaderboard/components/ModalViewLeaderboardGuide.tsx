'use client';

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";

interface ModalViewLeaderboardGuideProps {
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: any) => void
}

export default function ModalViewLeaderboardGuide({ id, titleHeader, callbackFunction }: ModalViewLeaderboardGuideProps) {
    const handleClose = () => {
        $(`#view_leaderboard_guide_${id}`).modal('hide');
        callbackFunction(null);
    }

    return (
        <>
            <ModalTemplate
                id={`view_leaderboard_guide_${id}`}
                size={"xl"}
                isModalScrollable={false}
                isModalCentered
                modalContentClassName="text-white"
                bodyClassName="p-0"
                body={
                    <>
                        <img src="/system-images/TIER_BADGE.png" className="img-fluid" />
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>
                    </>
                }
            />
        </>
    );
}