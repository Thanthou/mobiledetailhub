import { Camera, X } from 'lucide-react';
import React from 'react';

interface ProofOfWorkSectionProps {
  uploadedFiles: File[];
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
}

const ProofOfWorkSection: React.FC<ProofOfWorkSectionProps> = ({
  uploadedFiles,
  handleFileUpload,
  removeFile
}) => {
  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg">
      <div className="p-6 border-b border-stone-700">
        <h2 className="text-white text-lg font-semibold flex items-center">
          <Camera className="w-5 h-5 mr-2 text-orange-400" />
          Proof of Work
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Upload photos of your best work to showcase your skills
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <div className="block text-gray-300 text-sm font-medium mb-2">
            Upload Work Photos (2-3 images) <span className="text-red-400">*</span>
          </div>
          <div className="border-2 border-dashed border-stone-600 rounded-lg p-6 text-center hover:border-stone-500 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              name="work_photos"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-300 font-medium">Click to upload or drag and drop</p>
              <p className="text-gray-400 text-sm">PNG, JPG up to 3 images</p>
              <p className="text-gray-400 text-xs mt-1">Show us your best work!</p>
            </label>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-gray-300 text-sm font-medium">Uploaded Files:</p>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-stone-700 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Camera className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { removeFile(index); }}
                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-stone-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="bg-stone-700 p-4 rounded-lg mt-4">
            <p className="text-gray-300 text-sm">
              <span className="font-medium">Tip:</span> Choose 2-3 high-quality photos that best showcase your 
              detailing skills and finished results. Good lighting and clear &quot;before/after&quot; shots work great!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofOfWorkSection;
