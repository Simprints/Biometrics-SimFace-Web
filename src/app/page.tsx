import fs from 'fs';
import path from 'path';
import ClientPageWrapper from './dynamicclientpage'; 

const getImages = (dir: string): string[] => {
  const directory = path.join(process.cwd(), 'public', 'images', dir);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    return [];
  }
  const filenames = fs.readdirSync(directory);
  return filenames.map((name) => `${basePath}/images/${dir}/${name}`);
};

export default function Page() {
  const galleryImages = getImages('gallery');
  const probeImages = getImages('probe');

  return <ClientPageWrapper galleryImages={galleryImages} probeImages={probeImages} />;
}