'use client';

import { useCallback, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (files: FileList) => Promise<void>;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Memoize file validation
  const isValidFile = useCallback((file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    
    if (files.length > 0) {
      const file = files[0]; // Only take the first file
      if (isValidFile(file)) {
        setSelectedFiles([file]); // Only allow single file
      } else {
        console.warn('Invalid file type or size. Please upload PDF, DOC, or DOCX files under 10MB.');
      }
    } else {
      // Show error for invalid files
      console.warn('No valid files found. Please upload PDF, DOC, or DOCX files under 10MB.');
    }
  }, [isValidFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0]; // Only take the first file
      if (isValidFile(file)) {
        setSelectedFiles([file]); // Only allow single file
      } else {
        console.warn('Invalid file type or size. Please upload PDF, DOC, or DOCX files under 10MB.');
        // Clear the input
        e.target.value = '';
      }
    }
  };

  const handleUpload = useCallback(() => {
    if (selectedFiles.length > 0) {
      const fileList = new DataTransfer();
      selectedFiles.forEach(file => fileList.items.add(file));
      onFileUpload(fileList.files);
      setSelectedFiles([]);
    }
  }, [selectedFiles, onFileUpload]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  }, []);

  // Memoize total file size
  const totalSize = useMemo(() => {
    return selectedFiles.reduce((total, file) => total + file.size, 0);
  }, [selectedFiles]);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-2 border-dashed">
        <CardContent className="p-8">
          <div
            className={cn(
              "text-center transition-colors rounded-lg p-8",
              isDragOver && "bg-accent/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="bg-primary/10 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Upload your PDF document</h3>
            <p className="text-muted-foreground mb-6">
              Drag and drop your document here, or click to browse
            </p>
            
            <div className="space-y-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Choose Files
                </label>
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Maximum file size: 10MB • Supported formats: PDF, DOC, DOCX • Single file only
              </p>
            </div>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Selected File</h4>
                <span className="text-sm text-muted-foreground">
                  Size: {(totalSize / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button 
                onClick={handleUpload} 
                className="w-full"
                disabled={selectedFiles.length === 0}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}