import Link from "next/link";

export default function CustomBreadcrumb({ pageName }: { pageName: any[] }) {
    return (
        <>
            <section className="content-header px-0 pt-0 mt-0">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <nav aria-label="breadcrumb text--fontPos13--xW8hS">
                                <ol className="breadcrumb text-sm">
                                    <li key={0} className="breadcrumb-item">
                                        <i className="fas fa-home text-muted"></i>
                                    </li>

                                    {pageName.map((pageName, index) => (
                                        <li key={index + 1} className={`breadcrumb-item ${pageName.last ? 'active' : ''}}`}>
                                            <Link href={pageName.address ?? ''} className={`${pageName.last ? 'text-danger' : pageName.ilast ? 'text-light' : 'text-muted'} `}>{pageName.name}</Link>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}