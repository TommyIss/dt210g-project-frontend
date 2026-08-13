import { Link, useLocation } from "react-router-dom";

interface BreadcrumbsProps {
    pageLabel?: string;
    itemLabel?: string;
}

function Breadcrumbs({ pageLabel, itemLabel }: BreadcrumbsProps) {
    const location = useLocation();

    const pathParts = location.pathname.split('/').filter(Boolean);

    return(
        <div style={{ margin: '1rem 0'}}>
            <Link className="breadcrumbs-links" to={'/'}>Startsida</Link>
            {   pathParts[0] && pathParts[1] && (
                <>
                    {'/'}
                    <Link className="breadcrumbs-links" to={`/${pathParts[0]}`}>
                        {pageLabel ?? pathParts[0]}
                    </Link>
                    {'/'}
                    <span style={{ textDecoration: 'underline'}}>{itemLabel ?? pathParts[1]}</span>
                </>
            )}
        
            { pathParts[0] && !pathParts[1] && (
                <>
                    {'/'}
                    <span style={{ textDecoration: 'underline'}}>{pageLabel ?? pathParts[0]}</span>
                </>
            )}
        </div>
    )
}

export default Breadcrumbs;