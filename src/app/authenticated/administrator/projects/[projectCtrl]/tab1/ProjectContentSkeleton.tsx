import CustomUserPill from "@/app/custom-global-components/CustomUserPill/CustomUserPill";
import { Box, Skeleton } from "@mui/material";

export default function ProjectContentSkeleton() {
    return (
        <div>
            <div className="card-body">
                <div className="p-1 text-white">
                    <div className="mb-0">
                        <div className="row">
                            <div className="col-xl-9 mb-0 pt-1">
                                <Skeleton className='rounded' animation="wave" height={70} width={'90%'} />
                                <Skeleton className='rounded' animation="wave" height={30} width={'20%'} />
                            </div>

                            <div className="col-xl-3 mb-0">
                                <Box component="section" className="text-center">
                                    <Skeleton className='rounded' animation="wave" height={100} width={'100%'} />
                                </Box>
                            </div>
                        </div>
                    </div>

                    <div className="mt-0">
                        <Skeleton className='rounded' animation="wave" height={300} width={'100%'} />
                    </div>

                    <div className="bg-dark custom-border-dark mb-3">
                        <div className="row">
                            <div className="col-12 p-4 text-center">
                                <h5 className="text-bold text-muted">Completion Points</h5>
                                <div className="d-flex align-items-center justify-content-center"><Skeleton className='rounded' animation="wave" height={60} width={'20%'} /></div>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-muted">
                        <div className="col-xl-3 pr-5">
                            <div className="pr-5">
                                <div className="mb-0">Creator</div>
                                <Skeleton className='rounded' animation="wave" height={80} width={'100%'} />
                            </div>
                        </div>

                        <div className="mt-3 d-flex align-items-center justify-content-start">
                            Created at <Skeleton className='rounded ml-3' animation="wave" height={20} width={'20%'} />
                        </div>
                        <div className="mt-3 d-flex align-items-center justify-content-start">
                            Updated at <Skeleton className='rounded ml-3' animation="wave" height={20} width={'20%'} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}