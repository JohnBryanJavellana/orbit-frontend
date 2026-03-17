import { Box, Skeleton } from "@mui/material";
import './ViewUserContent.css';

export default function ViewUserContentSkeleton() {
    return (
        <>
            <div className="row">
                <div className="col-xl-8">
                    <div className="card custom-bg custom-border-dark rounded-0 elevation-1">
                        <div className="card-body">
                            <Box sx={{
                                height: '120px',
                                background: `linear-gradient(180deg, rgba(220, 53, 69, 0.2) 0%, transparent 100%)`,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 10
                            }}>
                                <Skeleton variant="circular" className='mt-3' animation="wave" height={100} width={100} />
                            </Box>

                            <Box sx={{
                                p: 4,
                                textAlign: 'center',
                            }}>
                                <div className="w-100">
                                    <div className="w-100 d-flex align-items-center justify-content-center "><Skeleton className='rounded' animation="wave" height={50} width={'50%'} /></div>
                                    <div className="w-100 d-flex align-items-center justify-content-center "><Skeleton className='rounded' animation="wave" height={30} width={'20%'} /></div>

                                    <div className="w-100 d-flex align-items-center justify-content-center mt-4"><Skeleton className='rounded' animation="wave" height={30} width={'100%'} /></div>
                                    <div className="w-100 d-flex align-items-center justify-content-center mb-4"><Skeleton className='rounded' animation="wave" height={30} width={'15%'} /></div>
                                </div>

                                <div className="mt-0">
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="row elevation-1 rounded-sm custom-border-dark">
                                                <div className="col-6 p-4 text-center">
                                                    <div className="text-bold">Task Deployed</div>
                                                    <div className="h3"><Skeleton className='rounded' animation="wave" height={30} width={'15%'} /></div>
                                                </div>
                                                <div className="col-6 p-4 custom-left-border-dark text-center">
                                                    <div className="text-bold">Task Accomplished</div>
                                                    <div className="h3"><Skeleton className='rounded' animation="wave" height={30} width={'15%'} /></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xl-12 p-0">
                                            <Skeleton className='rounded' animation="wave" height={200} width={'100%'} />
                                        </div>
                                    </div>
                                </div>
                            </Box>
                        </div>
                    </div>
                </div>

                <div className={`col-xl-4`}>
                    <Skeleton className='rounded' animation="wave" height={700} width={'100%'} />
                </div>
            </div>
        </>
    );
}