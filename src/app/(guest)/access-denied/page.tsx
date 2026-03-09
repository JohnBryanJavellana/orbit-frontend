'use client';

import { useEffect } from "react";
import Link from "next/link";
import useWebToken from "@/app/hooks/useWebToken";

export default function AccessDenied() {
    const { removeToken } = useWebToken();

    useEffect(() => {
        removeToken('csrf-token');
        removeToken('role-access');
    }, []);

    return (
        <div className={`guest-bg d-flex align-items-center justify-content-center`}>
            <div className="container p-0">
                <div className='row d-flex align-items-center justify-content-center'>
                    <div className='col-xl-8 text-center'>
                        <div className="card rounded-0 custom-bg custom-border-dark">
                            <div className="card-body py-5 text--fontPos13--xW8hS">
                                <span className='material-icons-outlined text-danger' style={{ fontSize: '3.5rem' }}>link_off</span>
                                <h1 className='text-bold' style={{ fontSize: '3.5rem' }}>OH! SNAP</h1>
                                YOU DO NOT HAVE ENOUGH PERMISSION TO ACCESS THIS PAGE OR THE PAGE IS BROKEN. <br />

                                <Link className='btn btn-danger text--fontPos13--xW8hS mt-4 btn3d' href="/">LOGIN INSTEAD</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}