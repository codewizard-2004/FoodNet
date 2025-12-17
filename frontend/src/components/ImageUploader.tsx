"use client";

import { Upload, X, ImageIcon } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploaderProps {
    onFileSelect: (file: File | null) => void;
    disabled?: boolean;
}

export function ImageUploader({ onFileSelect, disabled }: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (disabled) return;

        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onFileSelect(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="w-full h-full min-h-[300px] flex flex-col">
            <div
                onClick={() => !disabled && fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={onDrop}
                className={cn(
                    "flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all cursor-pointer relative overflow-hidden group",
                    isDragOver ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50",
                    disabled && "opacity-50 cursor-not-allowed",
                    preview ? "border-transparent" : ""
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={onInputChange}
                    disabled={disabled}
                />

                {preview ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-lg max-h-[400px]"
                        />
                        {!disabled && (
                            <button
                                onClick={clearImage}
                                className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center gap-4 text-zinc-400 group-hover:text-zinc-300">
                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="font-medium text-lg">Click to upload or drag and drop</p>
                            <p className="text-sm text-zinc-500 mt-1">SVG, PNG, JPG or GIF</p>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
