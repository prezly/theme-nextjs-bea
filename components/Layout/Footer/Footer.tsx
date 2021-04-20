import { useCompanyInformation } from '@/hooks/useCompanyInformation';

const Footer = () => {
    const companyInformation = useCompanyInformation();
    if (!companyInformation) {
        return null;
    }
    return (
        <footer>
            <h2>
                <>About</>
                {' '}
                {companyInformation.name}
            </h2>

            <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: companyInformation.about }}
            />

            <address>{companyInformation.address}</address>
        </footer>
    );
};

export default Footer;
