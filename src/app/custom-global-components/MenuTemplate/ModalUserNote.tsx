'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPopup from "../LoadingPopup/LoadingPopup";
import { Box, Checkbox, FormControl, FormHelperText, IconButton, Input, InputAdornment, OutlinedInput } from "@mui/material";
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";
import SearchIcon from '@mui/icons-material/Search';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import './ModalUserNote.css';
import CircularProgress from '@mui/material/CircularProgress';

interface ModalUserNoteProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: boolean) => void
}

export default function ModalUserNote({ data, id, titleHeader, callbackFunction }: ModalUserNoteProps) {
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isFetchingAudios, setIsFetchingAudios] = useState<boolean>(false);
    const [note, setNote] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [selectedTrackId, setSelectedTrackId] = useState<number>(0);
    const [noteAudios, setNoteAudios] = useState<any[]>([]);
    const [noteAudio, setNoteAudio] = useState<any | null>(null);
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();
    const MAX_CHARS = 20;
    const MAX_TRACKS = 50;
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
    const [audioPlayer] = useState(new Audio());
    const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
    const [audioProgress, setAudioProgress] = useState<number>(0);

    const handleTogglePreview = (track: any) => {
        if (currentlyPlaying === track.id) {
            audioPlayer.pause();
            audioPlayer.src = "";
            setCurrentlyPlaying(null);
            setIsAudioLoading(false);
            return;
        }

        audioPlayer.pause();
        setIsAudioLoading(true);
        setCurrentlyPlaying(track.id);

        audioPlayer.src = track.audio;
        audioPlayer.load();

        audioPlayer.oncanplay = () => {
            setIsAudioLoading(false);
            audioPlayer.play().catch(() => {
                setCurrentlyPlaying(null);
            });
        };

        audioPlayer.onended = () => {
            setCurrentlyPlaying(null);
            setIsAudioLoading(false);
        };

        audioPlayer.onerror = () => {
            setIsAudioLoading(false);
            setCurrentlyPlaying(null);
        };
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleClose = (returnRes: boolean = false) => {
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.src = "";
        }

        $(`#user_note_${id}`).modal('hide');
        callbackFunction(returnRes);
    }

    const UpdateUserNote = async () => {
        try {
            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer.src = "";
            }

            setIsSubmitting(true);
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('note', note);
            formData.append('music', JSON.stringify(noteAudio));

            const response = await axios.post(`${urlWithApi}/administrator/account/account/create_note`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            $(`#user_note_${id}`).modal('hide');

            setCallbackFunction({
                callbackFunction: () => handleClose(true)
            });

            setMessageAlert({
                message: response.data.message,
                status: 'SUCCESS'
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                $(`#user_note_${id}`).modal('hide');

                setCallbackFunction({
                    callbackFunction: () => handleClose(false)
                });

                if (error.response?.status === 500) {
                    navigate.push('/access-denied');
                } else {
                    setMessageAlert({
                        message: error.response?.data.message,
                        status: 'ERROR'
                    });
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const GetApiAudio = async (page: number) => {
        try {
            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer.src = "";
            }

            setCurrentPage(page);
            setIsFetchingAudios(true);
            setCurrentlyPlaying(null);

            const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
                params: {
                    client_id: 'e6c6ef22',
                    format: 'json',
                    limit: MAX_TRACKS,
                    offset: (page - 1) * MAX_TRACKS,
                    durationmin: 5,
                    durationmax: 80,
                    search: query,
                    order: 'relevance',
                    include: 'musicinfo',
                    audioformat: 'mp32'
                }
            });

            const results = response.data.results || [];
            const potentialTracks = results.filter((track: any) =>
                track.audio &&
                track.audiodownload_allowed === true &&
                track.duration <= 140
            );

            console.log("potentialTracks: ... ", potentialTracks);
            setNoteAudios(potentialTracks);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 500) {
                    navigate.push('/access-denied');
                } else if (status === 429) {
                    alert("Too many requests! Pixabay has a rate limit.");
                } else {
                    alert(error.response?.data?.message);
                }
            }
        } finally {
            setIsFetchingAudios(false);
        }
    }

    useEffect(() => {
        console.log(data);

        if (data) {
            if (data.note_audio) {
                try {
                    const parsed = typeof data.note_audio === 'string' ? JSON.parse(data.note_audio) : data.note_audio;
                    setNoteAudio(parsed);
                } catch (e) {
                    console.error("Failed to parse note_audio:", e);
                    setNoteAudio(null);
                }
            }

            setNote(data?.note ?? '');
        }
    }, [data]);

    useEffect(() => {
        if (!audioPlayer) return;

        const updateProgress = () => {
            const p = audioPlayer.currentTime / audioPlayer.duration;
            setAudioProgress(p || 0);
        };

        audioPlayer.addEventListener('timeupdate', updateProgress);
        return () => audioPlayer.removeEventListener('timeupdate', updateProgress);
    }, [audioPlayer]);

    const renderWaveform = (waveformJson: string, isPlaying: boolean, progress: number) => {
        try {
            const data = JSON.parse(waveformJson);
            const peaks = data.peaks || [];

            // Increase barCount for a fuller look on wide screens
            const barCount = 60;
            const step = Math.floor(peaks.length / barCount);
            const sampledPeaks = [];

            for (let i = 0; i < barCount; i++) {
                sampledPeaks.push(peaks[i * step]);
            }

            return (
                <div className="d-flex align-items-center justify-content-between w-100" style={{ height: '35px' }}>
                    {sampledPeaks.map((peak, i) => {
                        const barProgress = i / barCount;
                        const isPlayed = progress > barProgress;

                        return (
                            <div key={i} style={{
                                width: '1.5%',
                                height: `${Math.max(10, (peak / 100) * 100)}%`,
                                borderRadius: '1px',
                                backgroundColor: isPlaying ? (isPlayed ? '#00d2ff' : '#003d5c') : 'rgba(255,255,255,0.15)',
                                transition: 'background-color 0.3s ease, height 0.2s ease',
                                animationName: isPlaying && !isPlayed ? 'waveform-active' : 'none',
                                animationDuration: '1.2s',
                                animationTimingFunction: 'ease-in-out',
                                animationIterationCount: 'infinite',
                                animationDirection: 'alternate',
                                animationDelay: `${i * 0.02}s`
                            }} />
                        );
                    })}
                </div>
            );
        } catch (e) {
            return <div className="text-muted text-xs w-100 text-center">Waveform unavailable</div>;
        }
    };

    return (
        <>
            {isSubmitting && <LoadingPopup />}
            <MessageAlertPopup />

            <ModalTemplate
                id={`user_note_${id}`}
                size={"md"}
                isModalScrollable={false}
                modalContentClassName="text-white"
                isModalCentered
                headerClassName="border-0 pb-0"
                header={
                    <div className="w-100">
                        <div className="text-sm text-bold text-center w-100">{titleHeader}</div>
                        <hr className="style-two" />
                    </div>
                }
                bodyClassName="py-0"
                body={
                    <>
                        <label htmlFor="note" className='custom-label-color'>
                            Note
                        </label>

                        <FormControl fullWidth>
                            <Input
                                id="note"
                                type='text'
                                className='custom-field-bg'
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                disableUnderline
                                autoComplete='off'
                                inputProps={{ maxLength: MAX_CHARS }}
                                placeholder="Share a thought..."
                            />
                        </FormControl>

                        <FormHelperText sx={{ textAlign: 'right', marginRight: '8px' }}>
                            <Box component="span" sx={{ color: note.length >= MAX_CHARS ? 'error.main' : 'text.secondary' }}>
                                {note.length} / {MAX_CHARS}
                            </Box>
                        </FormHelperText>

                        {
                            noteAudio
                                ? <div className="mb-3 bg-dark custom-border-dark rounded overflow-hidden mt-3" style={{ userSelect: 'none' }}>
                                    <div key={noteAudio?.id} className={`row align-items-center g-0 p-2 hover-dark transition ${selectedTrackId === noteAudio?.id ? 'bg-secondary' : ''}`}>
                                        <div className="col-auto">
                                            <div className="position-relative rounded overflow-hidden bg-black d-flex align-items-center justify-content-center"
                                                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTogglePreview(noteAudio);
                                                }}>
                                                {noteAudio?.album_image ? (
                                                    <img src={noteAudio?.album_image} className="w-100 h-100 object-fit-cover position-absolute" alt="cover" style={{ opacity: '0.6' }} />
                                                ) : (
                                                    <PersonOutlineIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '30px' }} />
                                                )}

                                                <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 2 }}>
                                                    {isAudioLoading && currentlyPlaying === noteAudio?.id ? (
                                                        <CircularProgress size={20} className="mt-2" sx={{ color: 'white' }} />
                                                    ) : (
                                                        currentlyPlaying === noteAudio?.id ? (
                                                            <PauseCircleOutlineIcon sx={{ color: 'white', fontSize: '35px' }} />
                                                        ) : (
                                                            <PlayCircleOutlineIcon sx={{ color: 'white', fontSize: '35px' }} />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col px-3 text-truncate">
                                            <div className="text-white text-sm fw-bold mb-0 text-truncate">{noteAudio?.name}</div>
                                            <div className="text-muted text-xs text-truncate">{noteAudio?.artist_name}</div>
                                            <div className="text-muted text-xs">{formatDuration(noteAudio?.duration)}</div>
                                        </div>

                                        <div className="col-4 px-2">
                                            {renderWaveform(
                                                noteAudio?.waveform,
                                                currentlyPlaying === noteAudio?.id,
                                                currentlyPlaying === noteAudio?.id ? audioProgress : 0
                                            )}
                                        </div>

                                        <div className="col-auto ps-2">
                                            <Checkbox
                                                size="small"
                                                checked={noteAudio?.id === noteAudio?.id}
                                                onChange={(e, checked) => {
                                                    if (audioPlayer) {
                                                        audioPlayer.pause();
                                                        audioPlayer.src = "";
                                                    }

                                                    if (checked) setNoteAudio(noteAudio);
                                                    else setNoteAudio(null);
                                                }}
                                                sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: '#dc3545' } }}
                                            />
                                        </div>
                                    </div>
                                </div> : <>
                                    <label htmlFor="note" className='custom-label-color mt-2'>
                                        Choose Audio
                                    </label>

                                    <div className="mb-3 bg-dark custom-border-dark rounded overflow-hidden" style={{ userSelect: 'none' }}>
                                        <div className="p-2 custom-bottom-border-dark">
                                            <FormControl fullWidth variant="outlined" size="small">
                                                <OutlinedInput
                                                    placeholder="Search music (e.g. Lofi, Happy)..."
                                                    value={query}
                                                    onChange={(e) => setQuery(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && GetApiAudio(1)}
                                                    sx={{
                                                        color: 'white',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        borderRadius: '8px',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            border: 'none',
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            border: 'none',
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            border: 'none',
                                                        },
                                                    }}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="search music"
                                                                onClick={() => GetApiAudio(1)}
                                                                edge="end"
                                                                sx={{ color: 'gray' }}
                                                            >
                                                                <SearchIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </FormControl>
                                        </div>

                                        <div className="scrollContainer">
                                            {isFetchingAudios ? (
                                                <div className="text-center py-5">
                                                    <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                                    <div className="text-muted text-xs mt-2">Fetching tracks...</div>
                                                </div>
                                            ) : noteAudios.length > 0 ? (
                                                noteAudios.map((track) => (
                                                    <div key={track.id} className={`row align-items-center g-0 p-2 custom-bottom-border-dark hover-dark transition ${selectedTrackId === track.id ? 'bg-secondary' : ''}`}>
                                                        <div className="col-auto">
                                                            <div className="position-relative rounded overflow-hidden bg-black d-flex align-items-center justify-content-center"
                                                                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleTogglePreview(track);
                                                                }}>
                                                                {track.album_image ? (
                                                                    <img src={track.album_image} className="w-100 h-100 object-fit-cover position-absolute" alt="cover" style={{ opacity: '0.6' }} />
                                                                ) : (
                                                                    <PersonOutlineIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '30px' }} />
                                                                )}

                                                                <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 2 }}>
                                                                    {isAudioLoading && currentlyPlaying === track.id ? (
                                                                        <CircularProgress size={20} className="mt-2" sx={{ color: 'white' }} />
                                                                    ) : (
                                                                        currentlyPlaying === track.id ? (
                                                                            <PauseCircleOutlineIcon sx={{ color: 'white', fontSize: '35px' }} />
                                                                        ) : (
                                                                            <PlayCircleOutlineIcon sx={{ color: 'white', fontSize: '35px' }} />
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col px-3 text-truncate">
                                                            <div className="text-white text-sm fw-bold mb-0 text-truncate">{track.name}</div>
                                                            <div className="text-muted text-xs text-truncate">{track.artist_name}</div>
                                                            <div className="text-muted text-xs">{formatDuration(track.duration)}</div>
                                                        </div>

                                                        <div className="col-4 px-2">
                                                            {renderWaveform(
                                                                track.waveform,
                                                                currentlyPlaying === track.id,
                                                                currentlyPlaying === track.id ? audioProgress : 0
                                                            )}
                                                        </div>

                                                        <div className="col-auto ps-2">
                                                            <Checkbox
                                                                size="small"
                                                                checked={noteAudio?.id === track?.id}
                                                                onChange={(e, checked) => {
                                                                    if (audioPlayer) {
                                                                        audioPlayer.pause();
                                                                        audioPlayer.src = "";
                                                                    }

                                                                    if (checked) setNoteAudio(track);
                                                                    else setNoteAudio(null);
                                                                }}
                                                                sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: '#dc3545' } }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))) : (
                                                <div className="text-center py-4 text-muted text-sm" onClick={() => GetApiAudio(1)}>
                                                    <span className="material-icons-outlined d-block">queue_music</span>
                                                    Tap to discover music
                                                </div>
                                            )}
                                        </div>

                                        {noteAudios.length > 0 && (
                                            <div className="d-flex justify-content-between align-items-center p-2 bg-black">
                                                <button className="btn btn-link btn-sm text-decoration-none text-muted" disabled={currentPage === 1} onClick={() => GetApiAudio(currentPage - 1)}>
                                                    Prev
                                                </button>
                                                <span className="text-muted text-xs">Page {currentPage}</span>
                                                <button className="btn btn-link btn-sm text-decoration-none text-white" onClick={() => GetApiAudio(currentPage + 1)}>
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex flex-column" style={{ height: 30 }}>
                                        <div></div>
                                        <div className="mt-auto small text-muted">Your note stays up for 24 hours. We won't notify anyone when you post.</div>
                                    </div>
                                </>
                        }
                    </>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />
                        <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type='button' className='btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white' disabled={isSubmitting || (!note && !noteAudio) || isFetchingAudios} onClick={() => UpdateUserNote()}>
                            Save Note
                        </button>
                    </div>
                }
            />
        </>
    );
}