import { createContext, useContext, useEffect, useState } from 'react';
import { CameraContextProps } from '../types/camera.types';
import { Camera, CameraView } from 'expo-camera';

const CameraContext = createContext<CameraContextProps | null>(null);

export function useCustomCamera() {
  return useContext(CameraContext) as CameraContextProps;
}

export function CameraProvider({
  children,
}: Readonly<{ children: React.ReactElement }>) {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  function openCamera() {
    setIsCameraOpen(true);
  }

  function closeCamera() {
    setIsCameraOpen(false);
  }

  return (
    <CameraContext.Provider
      value={{
        isCameraOpen,
        openCamera,
        closeCamera,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
}
