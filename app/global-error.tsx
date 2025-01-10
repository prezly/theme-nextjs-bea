'use client';

import { Error as ErrorComponent } from '@/modules/Error';

import 'modern-normalize/modern-normalize.css';
import '@/styles/styles.globals.scss';

export default function Error() {
    return (
        <html>
            <style jsx global>{`
                body {
                    box-sizing: border-box;
                }

                .container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: Inter, sans-serif;
                    text-align: center;
                }

                .wrapper {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    padding: 48px;
                    gap: 36px;
                    max-width: 900px;
                }

                .title {
                    color: #1f2937;
                    font-weight: 700;
                    font-size: 48px;
                    line-height: 1.2;
                    margin-bottom: 16px;
                }

                .description {
                    color: #4b5563;
                    font-weight: 400;
                    font-size: 18px;
                    line-height: 1.6;
                    margin: 0;
                }

                .link {
                    font-size: 18px;
                    font-weight: 500;
                    text-decoration: none;
                    color: #4f46e5;
                    outline: none;
                    border: 0;
                    background: none;
                    padding: 0;
                }

                .link:hover {
                    color: #4f46e5;
                    text-decoration: underline;
                    cursor: pointer;
                }

                .illustration {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .svg {
                    width: 400px;
                    height: 220px;
                }

                @media (max-width: 768px) {
                    .svg {
                        width: 245px;
                        height: 136px;
                    }
                }
            `}</style>
            <body>
                <ErrorComponent />
            </body>
        </html>
    );
}
