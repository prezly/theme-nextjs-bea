import { getSitemapServerSideProps } from '@prezly/theme-kit-nextjs';
import type { NextPage } from 'next';

const Sitemap: NextPage = () => null;

export const getServerSideProps = getSitemapServerSideProps({ pinning: true });

export default Sitemap;
