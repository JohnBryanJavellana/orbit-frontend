import useDetectMobileViewport from "@/app/hooks/useDetectMobileViewport";
import { Skeleton } from "@mui/material";

export default function LeaderboardSkeleton() {
    const isMobileViewPort = useDetectMobileViewport();

    return (
        <>
            <div className='row pb-0'>
                <div className="col-xl-12 pb-0 d-flex align-items-center justify-content-end">
                    <Skeleton className='rounded' animation="wave" height={60} width={'10%'} />
                </div>
            </div>

            <div className='row mb-2 pt-0'>
                <div className="col-xl-12">
                    <Skeleton className='rounded' animation="wave" height={80} width={'100%'} />
                </div>
            </div>

            {
                Array.from(new Array(6)).map((_, index) => {
                    return <div className="row px-2 mb-2" key={index}>
                        <div className="col-xl-12">
                            <div className='row py-1 custom-bg custom-border-dark' key={index}>
                                <div className={`col-${isMobileViewPort ? 2 : 1} d-flex align-items-center justify-content-center text-center`}>
                                    <Skeleton variant='circular' animation="wave" height={50} width={50} />
                                </div>

                                <div className={`col-${isMobileViewPort ? 6 : 8}`}>
                                    <div>
                                        <Skeleton className='rounded' animation="wave" height={isMobileViewPort ? 20 : 30} width={'70%'} />
                                        <Skeleton className='rounded' animation="wave" height={isMobileViewPort ? 20 : 20} width={'20%'} />
                                        <Skeleton className='rounded' animation="wave" height={isMobileViewPort ? 20 : 20} width={'20%'} />
                                    </div>
                                </div>

                                <div className={`col-2 d-flex align-items-center justify-content-center`}>
                                    <Skeleton className='rounded' animation="wave" height={isMobileViewPort ? 20 : 30} width={'100%'} />
                                </div>

                                <div className={`col-${isMobileViewPort ? 2 : 1} d-flex align-items-center justify-content-center`}>
                                    <Skeleton className='rounded' animation="wave" height={isMobileViewPort ? 20 : 30} width={'20%'} />
                                </div>
                            </div>
                        </div>
                    </div>
                })
            }

            <div className='row mt-2'>
                <div className="col-xl-12 d-flex align-items-center justify-content-end">
                    <Skeleton className='rounded' animation="wave" height={30} width={'30%'} />
                </div>
            </div>
        </>
    );
}