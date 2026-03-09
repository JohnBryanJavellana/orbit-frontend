interface NoDataFoundProps {
    message: string
}

export default function NoDataFound({ message }: NoDataFoundProps) {
    return <>
        <p className='text-center text-muted' style={{ userSelect: 'none' }}>
            <img src='/system-images/no-results-bg.2d2c6ee3.png' height="200" /><br />
            {message}
        </p>
    </>;
}