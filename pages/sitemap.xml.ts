import { getSitemapServerSideProps } from '@prezly/theme-kit-nextjs';
import type { NextPage } from 'next';

const Sitemap: NextPage = () => null;

export const getServerSideProps = getSitemapServerSideProps();

export default Sitemap;
