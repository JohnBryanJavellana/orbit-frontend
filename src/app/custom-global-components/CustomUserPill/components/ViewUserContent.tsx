import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Typography } from "@mui/material";
import CustomAvatarWithOnlineBadge from "../../CustomAvatarWithOnlineBadge/CustomAvatarWithOnlineBadge";
import useGetRankAttribute2 from "@/app/hooks/useGetRankAttribute2";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import './ViewUserContent.css';
import ModalViewEnlargeAvatar from "../../CustomAvatarWithOnlineBadge/ModalViewEnlargeAvatar";
import { useEffect, useRef, useState } from "react";
import useDetectMobileViewport from "@/app/hooks/useDetectMobileViewport";

export default function ViewUserContent({ user, autoPlayNoteAudio = false }: { user: any, autoPlayNoteAudio?: boolean }) {
    const { getRankAttribute } = useGetRankAttribute2();
    const { urlWithoutApi } = useSystemURLCon();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
    const isMobileViewPort = useDetectMobileViewport();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const EndExistingPlayingAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
            audioRef.current.load();
            audioRef.current = null;
        }
    }

    const PlayAudio = (userData: any) => {
        if (userData?.custom_user_note?.note_audio && autoPlayNoteAudio) {
            const music = typeof userData.custom_user_note.note_audio === 'string'
                ? JSON.parse(userData.custom_user_note.note_audio)
                : userData.custom_user_note.note_audio;

            if (!audioRef.current) {
                audioRef.current = new Audio();
            }

            setIsAudioLoading(true);
            audioRef.current.src = music.audio;
            audioRef.current.loop = true;

            audioRef.current.oncanplay = () => {
                setIsAudioLoading(false);
                audioRef.current?.play().catch(err => console.error("Audio playback failed:", err));
            };
        }
    }

    useEffect(() => {
        if (user && autoPlayNoteAudio) {
            PlayAudio(user);
        }

        return () => {
            EndExistingPlayingAudio();
        };
    }, [user, autoPlayNoteAudio]);

    return (
        <>
            {
                isModalOpen &&
                <ModalViewEnlargeAvatar
                    data={user}
                    callbackFunction={() => {
                        setIsModalOpen(false);
                        PlayAudio(user);
                    }}
                />
            }


            <div className="row">
                <div className="col-xl-8">
                    <div className="card custom-bg custom-border-dark rounded-0 elevation-1">
                        <div className="card-body">
                            <Box sx={{
                                height: '120px',
                                background: `linear-gradient(180deg, rgba(220, 53, 69, 0.2) 0%, transparent 100%)`,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                position: 'relative',
                                zIndex: 10
                            }}>
                                <div style={{ transform: 'translateY(60px)' }} data-toggle="modal" data-target={`#view_enlarge_avatar_${user?.id}`} onClick={() => {
                                    setIsModalOpen(true);
                                    EndExistingPlayingAudio();
                                }}>
                                    <CustomAvatarWithOnlineBadge
                                        height={120}
                                        width={120}
                                        data={user}
                                        src={`${urlWithoutApi}/user-images/${user.profile_picture}`}
                                        isOnline={user.is_online}
                                        isAdmin={user.role === "SUPERADMIN"}
                                        srcShown={user.custom_avatar.shown_avatar}
                                        showNote
                                        isAudioLoading={autoPlayNoteAudio && isAudioLoading}
                                        runAudio={autoPlayNoteAudio}
                                    />
                                </div>
                            </Box>

                            <Box sx={{
                                p: 4,
                                pt: '90px',
                                textAlign: 'center'
                            }}>
                                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                                    {user.first_name} {user.middle_name} {user.last_name} {user.suffix ?? ''}
                                </Typography>

                                <Typography variant="body2" sx={{ color: '#adb5bd', mb: 2 }}>
                                    {user.email}
                                </Typography>

                                <div dangerouslySetInnerHTML={{ __html: user.bio }} />

                                <div className="mt-5">
                                    {
                                        ["ADMINISTRATOR", "SUPERADMIN"].includes(user.role)
                                            ? <>
                                                <div className="row">
                                                    <div className="col-xl-12">
                                                        <div className="row elevation-1 rounded-sm custom-border-dark border-bottom-0">
                                                            <div className="col-xl-6 p-4 text-center custom-bottom-border-dark">
                                                                <div className="text-bold">Task Deployed</div>
                                                                <div className="h3">{user.user_profile_view.stats?.deployed_tasks}</div>
                                                            </div>
                                                            <div className={`col-xl-6 p-4 ${isMobileViewPort ? '' : 'custom-left-border-dark'} custom-bottom-border-dark text-center`}>
                                                                <div className="text-bold">Task Accomplished</div>
                                                                <div className="h3">{user.user_profile_view.stats?.accomplished_tasks}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-xl-12 p-0">
                                                        <Accordion disableGutters expanded={true} className="bg-dark rounded-sm elevation-1 custom-border-dark mt-2">
                                                            <AccordionSummary
                                                                aria-controls="panel1-content"
                                                                id="panel1-header"
                                                            >
                                                                <Typography component="span">Created Projects</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails className="text-left">
                                                                {
                                                                    user.user_profile_view.stats?.created_projects.length > 0
                                                                        ? user.user_profile_view.stats?.created_projects.map((project: any, index: number) => {
                                                                            return <div key={index}>
                                                                                <div className="p-2 text-white">
                                                                                    {project?.name}
                                                                                </div>

                                                                                {index < user.user_profile_view.stats.created_projects.length - 1 && <Divider sx={{ opacity: '0.3' }} />}
                                                                            </div>
                                                                        }) : <i className="text-muted">No projects yet.</i>
                                                                }
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </div>
                                                </div>
                                            </> : <>
                                                <div className="row">
                                                    <div className="col-xl-12">
                                                        <div className="row elevation-1 rounded-sm custom-border-dark border-bottom-0">
                                                            <div className="col-xl-6 p-4 text-center custom-bottom-border-dark">
                                                                <div className="text-bold">Task Applied</div>
                                                                <div className="h3">{user.user_profile_view.stats?.assigned_tasks}</div>
                                                            </div>
                                                            <div className={`col-xl-6 p-4 ${isMobileViewPort ? '' : 'custom-left-border-dark'} custom-bottom-border-dark text-center`}>
                                                                <div className="text-bold">Task Accomplished</div>
                                                                <div className="h3">{user.user_profile_view.stats?.finished_tasks}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                    }
                                </div>
                            </Box>
                        </div>
                    </div>
                </div >

                <div className={`col-xl-4 text-center`} style={{ userSelect: 'none' }}>
                    <div className="card custom-bg custom-border-dark rounded-0 elevation-1">
                        <div className="card-body">
                            {getRankAttribute(user.role === "SUPERADMIN" ? 'Ω' : user.role === "ADMINISTRATOR" ? '∞' : user.total_points)}
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}