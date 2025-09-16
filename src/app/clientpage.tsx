"use client";

import React, { useState, useEffect, useRef } from "react";
import { getEmbedding, cosineSimilarity, loadModels } from "@/lib/faceApi";
import ResultDisplay from "@/components/ResultDisplay";
import ImageSelector from "@/components/ImageSelector";
import Modal from "@/components/Modal";
import LoadingComponent from "@/components/LoadingComponent";
import FaceInput from "@/components/FaceInput";

interface ClientPageProps {
  galleryImages: string[];
  probeImages: string[];
}

export default function ClientPage({
  galleryImages,
  probeImages,
}: ClientPageProps) {
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
  };

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

  const openModal = (type: "gallery" | "probe") => {
    if (type === "gallery") {
      setModalConfig({
        title: "Gallery 1",
        images: galleryImages,
        onSelect: handleImageASelect,
      });
    } else {
      setModalConfig({
        title: "Gallery 2",
        images: probeImages,
        onSelect: handleImageBSelect,
      });
    }
    setIsModalOpen(true);
  };

  if (loadingModels) {
    return <LoadingComponent />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-16 bg-gray-100">
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalConfig?.title || ""}
      >
        {modalConfig && (
          <ImageSelector
            images={modalConfig.images}
            onSelect={modalConfig.onSelect}
          />
        )}
      </Modal>

      <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
        😀 SimFace
      </h1>
      <p className="text-gray-500 mb-8">
        Compare any two faces and see the biometric result
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <FaceInput
          title="1."
          imageSrc={imageA}
          imageRef={imageARef}
          onImageSelect={handleImageASelect}
          onGalleryClick={() => openModal("gallery")}
          hasGallery={galleryImages.length > 0}
          uploaderId="file-upload-1"
        />

        <div className="flex flex-col items-center justify-center">
          <ResultDisplay similarity={similarity} />
          <button
            onClick={handleCompare}
            disabled={!imageA || !imageB || comparing}
            className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer transition-colors"
          >
            {comparing ? "Comparing.." : "Compare"}
          </button>
        </div>

        <FaceInput
          title="2."
          imageSrc={imageB}
          imageRef={imageBRef}
          onImageSelect={handleImageBSelect}
          onGalleryClick={() => openModal("probe")}
          hasGallery={probeImages.length > 0}
          uploaderId="file-upload-2"
        />
      </div>
    </main>
  );
}
