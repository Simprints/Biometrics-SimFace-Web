'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getEmbedding, cosineSimilarity, loadModels } from '@/lib/faceApi';
import ImageUploader from '@/components/ImageUploader';
import ResultDisplay from '@/components/ResultDisplay';
import ImageSelector from '@/components/ImageSelector';
import Modal from '@/components/Modal';

interface ClientPageProps {
  galleryImages: string[];
  probeImages: string[];
}

export default function ClientPage({ galleryImages, probeImages }: ClientPageProps) {
    const [imageA, setImageA] = useState<string | null>(null);
    const [imageB, setImageB] = useState<string | null>(null);
    const [similarity, setSimilarity] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('Loading models...');
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
          setStatus('');
          setLoading(false);
        }
        load();
    }, []);

    const handleCompare = async () => {
        if (imageARef.current && imageBRef.current) {
          setLoading(true);
          setStatus('Generating embeddings...');
          const embeddingA = await getEmbedding(imageARef.current);
          const embeddingB = await getEmbedding(imageBRef.current);

          if (embeddingA && embeddingB) {
              setStatus('Comparing embeddings...');
              const sim = cosineSimilarity(embeddingA, embeddingB);
              setSimilarity(sim);
              embeddingA.dispose();
              embeddingB.dispose();
          }
          setStatus('');
          setLoading(false);
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
          title: 'Select from Gallery',
          images: galleryImages,
          onSelect: handleImageASelect,
        });
      } else {
        setModalConfig({
          title: 'Select from Probe',
          images: probeImages,
          onSelect: handleImageBSelect,
        });
      }
      setIsModalOpen(true);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 bg-gray-100">
          <Modal isOpen={isModalOpen} onClose={closeModal} title={modalConfig?.title || ''}>
            {modalConfig && (
              <ImageSelector
                images={modalConfig.images}
                onSelect={modalConfig.onSelect}
              />
            )}
          </Modal>

     
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">SimFace Demo</h1>


        

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Face 1</h2>
                <div className="space-y-4">
                  <ImageUploader onImageSelect={handleImageASelect} />
                  {galleryImages.length > 0 && (
                    <button onClick={() => openModal('gallery')} className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                      Select from Gallery
                    </button>
                  )}
                  {imageA && <img ref={imageARef} src={imageA} alt="Face 1" className="mt-4 rounded-lg aspect-square object-cover" crossOrigin='anonymous'/>}
                </div>
              </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Face 2</h2>
                <div className="space-y-4">
                  <ImageUploader onImageSelect={handleImageBSelect} />
                  {probeImages.length > 0 && (
                    <button onClick={() => openModal('probe')} className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                      Select from Gallery
                    </button>
                  )}
                  {imageB && <img ref={imageBRef} src={imageB} alt="Face 2" className="mt-4 rounded-lg aspect-square object-cover" crossOrigin='anonymous'/>}
                </div>
              </div>
          </div>

          <button
              onClick={handleCompare}
              disabled={!imageA || !imageB || loading}
              className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400"
              >
              {loading ? 'Comparing...' : 'Compare'}
          </button>

          {loading && <p className="text-lg text-gray-600 my-4">{status}</p>}

          {similarity !== null && <ResultDisplay similarity={similarity} />}
        </main>
    );
}