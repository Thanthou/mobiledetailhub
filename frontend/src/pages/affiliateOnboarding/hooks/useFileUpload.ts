import { useState, useCallback } from 'react';
import { AffiliateApplication } from '../types';

export const useFileUpload = (handleInputChange: (field: string, value: any) => void) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    setUploadedFiles(prevFiles => {
      if (prevFiles.length + imageFiles.length > 3) {
        alert('Maximum 3 images allowed');
        return prevFiles;
      }

      const newFiles = [...prevFiles, ...imageFiles].slice(0, 3);
      
      handleInputChange('uploads', newFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      })));
      
      return newFiles;
    });
  }, [handleInputChange]);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prevFiles => {
      const newFiles = prevFiles.filter((_, i) => i !== index);
      
      handleInputChange('uploads', newFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      })));
      
      return newFiles;
    });
  }, [handleInputChange]);

  return {
    uploadedFiles,
    handleFileUpload,
    removeFile
  };
};
