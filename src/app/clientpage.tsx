'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getEmbedding, cosineSimilarity, loadModels } from '@/lib/faceApi';
import ImageUploader from '@/components/ImageUploader';
import ResultDisplay from '@/components/ResultDisplay';
import ImageSelector from '@/components/ImageSelector';
import Modal from '@/components/Modal';
import { FaceSmileIcon } from '@heroicons/react/24/outline';
import LoadingComponent from '@/components/LoadingComponent';

interface ClientPageProps {
  galleryImages: string[];
  probeImages: string[];
}

export default function ClientPage({ galleryImages, probeImages }: ClientPageProps) {
  const [imageA, setImageA] = useState<string | null>(null);
  const [imageB, setImageB] = useState<string | null>(null);
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [loadingModels, setLoadingModels] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    images: string[];
    onSelect: (image: string) => void;
  } | null>(null);

  const imageARef = useRef<HTMLImageElement>(null);
  const imageBRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    async function load() {
      await loadModels();
      setLoadingModels(false);
    }
    load();
  }, []);

  const handleCompare = async () => {
    if (imageARef.current && imageBRef.current) {
      setComparing(true);
      const embeddingA = await getEmbedding(imageARef.current);
      const embeddingB = await getEmbedding(imageBRef.current);

      if (embeddingA && embeddingB) {
        const sim = cosineSimilarity(embeddingA, embeddingB);
        setSimilarity(sim);
        embeddingA.dispose();
        embeddingB.dispose();
      }
      setComparing(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalConfig(null);
  }

  const handleImageASelect = (image: string) => {
    setImageA(image);
    setSimilarity(null);
    closeModal();
  };

  const handleImageBSelect = (image: string) => {
    setImageB(image);
    setSimilarity(null);
    closeModal();
  };

  const openModal = (type: 'gallery' | 'probe') => {
    if (type === 'gallery') {
      setModalConfig({
        title: 'Gallery 1',
        images: galleryImages,
        onSelect: handleImageASelect,
      });
    } else {
      setModalConfig({
        title: 'Gallery 2',
        images: probeImages,
        onSelect: handleImageBSelect,
      });
    }
    setIsModalOpen(true);
  }

  if (loadingModels) {
    return <LoadingComponent />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-16 bg-gray-100">
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalConfig?.title || ''}>
        {modalConfig && (
          <ImageSelector
            images={modalConfig.images}
            onSelect={modalConfig.onSelect}
          />
        )}
      </Modal>


      <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">😀 SimFace</h1>
      <p className="text-gray-500 mb-8">Compare any two faces and see the biometric result</p>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-500">1.</h2>
          <div className="space-y-4">
            <ImageUploader onImageSelect={handleImageASelect} />
            {galleryImages.length > 0 && (
              <button onClick={() => openModal('gallery')} className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 cursor-pointer transition-colors">
                Select from Gallery
              </button>
            )}
            <div className='aspect-square bg-gray-100 flex items-center justify-center rounded-lg'>
              {imageA ?
                <img ref={imageARef} src={imageA} alt="Face 1" className="rounded-lg aspect-square object-cover" crossOrigin='anonymous' /> :
                <FaceSmileIcon className='w-20 bg-gray-100' />}
            </div>

          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <ResultDisplay similarity={similarity} />
          <button
            onClick={handleCompare}
            disabled={!imageA || !imageB || comparing}
            className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer transition-colors"
          >
            {comparing ? "Comparing.." : 'Compare'}
          </button>
          
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-500">2.</h2>
          <div className="space-y-4">
            <ImageUploader onImageSelect={handleImageBSelect} />
            {probeImages.length > 0 && (
              <button onClick={() => openModal('probe')} className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 cursor-pointer transition-colors">
                Select from Gallery
              </button>
            )}
            <div className='aspect-square bg-gray-100 flex items-center justify-center rounded-lg'>
              {imageB ? 
                <img ref={imageBRef} src={imageB} alt="Face 2" className="rounded-lg aspect-square object-cover" crossOrigin='anonymous' />
                : <FaceSmileIcon className='w-20 bg-gray-100' />
                }
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}