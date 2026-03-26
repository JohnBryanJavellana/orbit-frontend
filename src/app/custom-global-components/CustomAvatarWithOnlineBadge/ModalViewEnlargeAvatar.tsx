import useSystemURLCon from '@/app/hooks/useSystemURLCon';
import ModalTemplate from '../ModalTemplate/ModalTemplate';
import CustomAvatarWithOnlineBadge from './CustomAvatarWithOnlineBadge';
import { useEffect, useState } from 'react';

interface Props {
    data: any,
    callbackFunction?: (e: any) => void
}

// 55180966-3e5ace594d1d6d2915e9b35b1 PIXIBAY API KEY

const ModalViewEnlargeAvatar = ({ data, callbackFunction }: Props) => {
    const { urlWithoutApi } = useSystemURLCon();
    const [audioPlayer] = useState(new Audio());
    const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);

    useEffect(() => {
        if (data?.custom_user_note?.note_audio) {
            const music = typeof data?.custom_user_note.note_audio === 'string'
                ? JSON.parse(data?.custom_user_note.note_audio)
                : data?.custom_user_note.note_audio;

            setIsAudioLoading(true);
            audioPlayer.src = music.audio;
            audioPlayer.loop = true;
            audioPlayer.load();

            audioPlayer.oncanplay = () => {
                setIsAudioLoading(false);
                audioPlayer.play();
            };
        }
    }, [data]);

    const handleClose = () => {
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.src = "";
        }

        $(`#view_enlarge_avatar_${data?.id}`).modal('hide');
        callbackFunction?.(null);
    }

    return <div>
        <ModalTemplate
            id={`view_enlarge_avatar_${data?.id}`}
            size={"md"}
            isModalScrollable={false}
            modalParentStyle='bg-stack'
            modalContentClassName="text-white"
            headerClassName="border-0 pb-0"
            isModalCentered
            header={
                <div className="w-100">
                    <div className="text-sm text-bold text-center w-100">{`${data.first_name} ${data.middle_name} ${data.last_name} ${data.suffix ?? ''}`}</div>
                    <hr className="style-two" />
                </div>
            }
            bodyClassName="pb-0 pt-4"
            body={
                <>
                    <div className="d-flex align-items-center justify-content-center">
                        <CustomAvatarWithOnlineBadge
                            height={200}
                            width={200}
                            data={data}
                            src={`${urlWithoutApi}/user-images/${data.profile_picture}`}
                            isOnline={data.is_online}
                            isAdmin={data.role === "SUPERADMIN"}
                            srcShown={data.custom_avatar.shown_avatar}
                            showNote
                            isAudioLoading={isAudioLoading}
                        />
                    </div>
                </>
            }
            footerClassName="border-0"
            footer={
                <div className="w-100 text-center">
                    <hr className="style-two" />
                    <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                        CLOSE
                    </button>
                </div>
            }
        />
    </div>
}

export default ModalViewEnlargeAvatar;