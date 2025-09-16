import fs from 'fs';
import path from 'path';
import ClientPage from './clientpage';

const getImages = (dir: string): string[] => {
  const directory = path.join(process.cwd(), 'public', 'images', dir);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    return [];
  }
  const filenames = fs.readdirSync(directory);
  return filenames.map((name) => `/images/${dir}/${name}`);
};

export default function Page() {
  const galleryImages = getImages('gallery');
  const probeImages = getImages('probe');

  return <ClientPage galleryImages={galleryImages} probeImages={probeImages} />;
}