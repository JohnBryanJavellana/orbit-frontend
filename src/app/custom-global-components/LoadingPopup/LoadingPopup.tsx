export default function LoadingPopup() {
    return (
        <>
            <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center"
                style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9999,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    margin: 0,
                    padding: 0
                }}>
                <div className="text-center">
                    <img
                        src={`/original-f84e62d656e844af9cbd8067375e7885.gif`}
                        height={50}
                        alt="Loading..."
                    />
                    <p className="mt-3 text-white text-sm" style={{ fontFamily: 'Georgia', letterSpacing: '2px' }}>
                        SYNCHRONIZING WITH ORBIT...
                    </p>
                </div>
            </div>
        </>
    );
}