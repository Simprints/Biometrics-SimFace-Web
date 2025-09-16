'use client';

import LoadingComponent from '@/components/LoadingComponent';
import dynamic from 'next/dynamic';

// Define the props interface to match ClientPage
interface ClientPageProps {
  galleryImages: string[];
  probeImages: string[];
}

// Dynamically import ClientPage with SSR turned off inside a Client Component
const DynamicClientPage = dynamic(() => import('./clientpage'), {
  ssr: false,
  // You can add a loading component here if you wish
  loading: () => <LoadingComponent />, 
});

// This component simply passes the props through to the dynamically loaded one
const ClientPageWrapper = ({ galleryImages, probeImages }: ClientPageProps) => {
  return <DynamicClientPage galleryImages={galleryImages} probeImages={probeImages} />;
};

export default ClientPageWrapper;