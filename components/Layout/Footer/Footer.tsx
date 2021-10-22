import { useNewsroom } from '@/hooks/useNewsroom';
import { LogoPrezly } from '@/icons';
import { getPrivacyPortalUrl } from '@/utils/prezly';

import styles from './Footer.module.scss';

const Footer = () => {
    const newsroom = useNewsroom();

    return (
        <footer className={styles.container}>
            <div className="container">
                <div className={styles.footer}>
                    <div className={styles.links}>
                        {/* TODO: Add real link */}
                        <a href="#" className={styles.link}>
                            Privacy Request
                        </a>
                        <a
                            href={getPrivacyPortalUrl(newsroom, { action: 'unsubscribe' })}
                            className={styles.link}
                        >
                            Unsubscribe
                        </a>
                        {/* TODO: Implement cookie consent logic */}
                        <a href="#" className={styles.link}>
                            Stop using cookies
                        </a>
                    </div>
                    <div className={styles.poweredBy}>
                        Powered by
                        <a
                            href="https://prezly.com"
                            className={styles.prezly}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <LogoPrezly />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
