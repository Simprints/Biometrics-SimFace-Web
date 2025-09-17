"use client";

import React, { useState, useEffect } from "react";
import {
  getEmbedding,
  cosineSimilarity,
  loadModels,
  FaceAlignmentError,
} from "@/lib/faceApi";
import ResultDisplay from "@/components/ResultDisplay";
import ImageSelector from "@/components/ImageSelector";
import Modal from "@/components/Modal";
import LoadingComponent from "@/components/LoadingComponent";
import FaceInput from "@/components/FaceInput";
import * as tf from "@tensorflow/tfjs";

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
  const [embeddingA, setEmbeddingA] = useState<tf.Tensor | null>(null);
  const [embeddingB, setEmbeddingB] = useState<tf.Tensor | null>(null);
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [loadingModels, setLoadingModels] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    images: string[];
    onSelect: (image: string) => void;
    trueMatch: string | null;
  } | null>(null);
  const [trueMatchA, setTrueMatchA] = useState<string | null>(null);
  const [trueMatchB, setTrueMatchB] = useState<string | null>(null);
  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      await loadModels();
      setLoadingModels(false);
    }
    load();
  }, []);

  // Automatically compare when both embeddings are available
  useEffect(() => {
    const compareEmbeddings = () => {
      if (embeddingA && embeddingB) {
        const sim = cosineSimilarity(embeddingA, embeddingB);
        setSimilarity(sim);
      }
    };

    compareEmbeddings();
  }, [embeddingA, embeddingB]);

  const closeModal = () => {
    setIsModalOpen(false);
    setModalConfig(null);
  };

  const getTrueMatch = (selectedImage: string, images: string[]) => {
    const selectedId = selectedImage.split("/").pop()?.substring(0, 6);
    return (
      images.find((img) =>
        img
          .split("/")
          .pop()
          ?.startsWith(selectedId ?? "")
      ) || null
    );
  };

  const processAndStoreEmbedding = async (
    imageElement: HTMLImageElement,
    setEmbedding: React.Dispatch<React.SetStateAction<tf.Tensor | null>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    currentEmbedding: tf.Tensor | null
  ) => {
    currentEmbedding?.dispose();
    setEmbedding(null);
    setError(null);

    try {
      const newEmbedding = await getEmbedding(imageElement);
      setEmbedding(newEmbedding);
    } catch (error) {
      if (error instanceof FaceAlignmentError) {
        setError(error.message);
      } else {
        setError("An unknown error occurred during validation.");
        console.error(error);
      }
    }
  };

  const handleImageASelect = (image: string) => {
    setImageA(image);
    setTrueMatchB(getTrueMatch(image, probeImages));
    setSimilarity(null);
    closeModal();

    const img = new Image();
    img.src = image;
    img.onload = () => {
      processAndStoreEmbedding(img, setEmbeddingA, setErrorA, embeddingA);
    };
    img.onerror = () => {
      setErrorA("Failed to load image for processing.");
    };
  };

  const handleImageBSelect = (image: string) => {
    setImageB(image);
    setTrueMatchA(getTrueMatch(image, galleryImages));
    setSimilarity(null);
    closeModal();

    const img = new Image();
    img.src = image;
    img.onload = () => {
      processAndStoreEmbedding(img, setEmbeddingB, setErrorB, embeddingB);
    };
    img.onerror = () => {
      setErrorB("Failed to load image for processing.");
    };
  };

  const openModal = (type: "gallery" | "probe") => {
    if (type === "gallery") {
      setModalConfig({
        title: "Gallery 1",
        images: galleryImages,
        onSelect: handleImageASelect,
        trueMatch: trueMatchA,
      });
    } else {
      setModalConfig({
        title: "Gallery 2",
        images: probeImages,
        onSelect: handleImageBSelect,
        trueMatch: trueMatchB,
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
            trueMatch={modalConfig.trueMatch}
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
          onImageSelect={handleImageASelect}
          onGalleryClick={() => openModal("gallery")}
          hasGallery={galleryImages.length > 0}
          uploaderId="file-upload-1"
          error={errorA}
        />

        <div className="flex flex-col items-center justify-center">
          <ResultDisplay similarity={similarity} />
        </div>

        <FaceInput
          title="2."
          imageSrc={imageB}
          onImageSelect={handleImageBSelect}
          onGalleryClick={() => openModal("probe")}
          hasGallery={probeImages.length > 0}
          uploaderId="file-upload-2"
          error={errorB}
        />
      </div>
    </main>
  );
}
