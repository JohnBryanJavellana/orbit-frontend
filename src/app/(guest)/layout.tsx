export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return <div className="guest-bg position-absolute w-100 d-flex align-items-center justify-content-center h-100 bg-dark">
        <div className="container">
            {children}
        </div>
    </div>
};