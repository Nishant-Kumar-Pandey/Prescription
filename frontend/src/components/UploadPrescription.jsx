import { useState, useRef } from 'react';

const UploadPrescription = ({ onUpload }) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(null);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files[0]);
        }
    };

    const handleFiles = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            onUpload(file);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={`glass-card p-10 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 ${dragActive ? 'border-medical-primary bg-medical-primary/5' : 'border-slate-300'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}>

            {!preview ? (
                <>
                    <div className="w-20 h-20 bg-medical-primary/10 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-medical-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Upload Prescription</h2>
                    <p className="text-slate-500 mb-6 text-center">Drag and drop your prescription image here, or click to browse</p>
                    <button onClick={() => inputRef.current.click()} className="btn-primary">Choose File</button>
                </>
            ) : (
                <div className="w-full flex flex-col items-center">
                    <img src={preview} alt="Preview" className="max-h-64 rounded-lg mb-6 shadow-md" />
                    <button onClick={() => setPreview(null)} className="text-red-500 text-sm font-medium hover:underline">Remove and change</button>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
            />
        </div>
    );
};

export default UploadPrescription;
