'use client';

import { Skeleton } from "@mui/material";

interface TableSkeletonProps {
    columns: any[],
    rows?: number
}

export default function TableSkeleton({ columns, rows }: TableSkeletonProps) {
    return (
        <div style={{ width: '100%', padding: '10px' }}>
            <div className="d-flex mb-2 rounded p-2 border-bottom border-dark">
                {columns.map((c, i) => (
                    <div key={i} className="text-bold text-sm" style={{ flex: 1, padding: '0 10px' }}>
                        {c.name}
                    </div>
                ))}
            </div>

            {[...Array(rows)].map((_, rowIndex) => (
                <div key={rowIndex} className={`d-flex ${rowIndex < 4 && 'border-bottom border-dark'}`} style={{ padding: '15px 10px' }}>
                    {columns.map((_, colIndex) => (
                        <div key={colIndex} style={{ flex: 1, padding: '0 10px' }}>
                            <Skeleton variant="rectangular" className="rounded" width="80%" height={15} />
                        </div>
                    ))}
                </div>
            ))}

            <div className="row mt-3">
                <div className="col-xl-9"></div>
                <div className="col-xl-3">
                    <Skeleton variant="rectangular" className="rounded" width="100%" height={18} />
                </div>
            </div>
        </div>
    );
}