import styles from './Header.module.scss';

export function HeaderSkeleton() {
    return (
        <header className={styles.container}>
            <div className="container" />
        </header>
    );
}
