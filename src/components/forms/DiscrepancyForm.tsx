'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function DiscrepancyForm() {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    branch: '',
    semester: '',
    givenGpa: '',
    updatedGpa: '',
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (validTypes.includes(selectedFile.type)) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setErrorMessage('File size must be less than 5MB');
        setFile(null);
      } else {
        setFile(selectedFile);
        setErrorMessage('');
      }
    } else {
      setErrorMessage('Please upload a PDF, JPG, or PNG file');
      setFile(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please upload a proof document');
      return;
    }

    // Basic Roll Number format validation (e.g., 23/ME/123)
    const rollRegex = /^\d{2}\/[A-Z]{2,3}\/\d{3}$/i;
    if (!rollRegex.test(formData.rollNumber)) {
      setErrorMessage('Invalid Roll Number format. Expected format: 23/ME/123');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append('file', file);

    try {
      const res = await fetch('/api/discrepancy', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      
      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', rollNumber: '', branch: '', semester: '', givenGpa: '', updatedGpa: '' });
        setFile(null);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Something went wrong');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Failed to connect to the server');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Report Submitted</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Your discrepancy report and proof have been securely uploaded. The administrators will review it shortly and update your CGPA.
        </p>
        <button 
          onClick={() => setSubmitStatus('idle')}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">File a Discrepancy</h2>
      
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
            <input 
              required
              type="text" 
              name="name" 
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Roll Number</label>
            <input 
              required
              type="text" 
              name="rollNumber" 
              value={formData.rollNumber}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase" 
              placeholder="e.g. 23/ME/123"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Branch</label>
            <select 
              required
              name="branch" 
              value={formData.branch}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Branch...</option>
              <option value="CS">CS</option>
              <option value="IT">IT</option>
              <option value="SE">SE</option>
              <option value="MC">MC</option>
              <option value="EC">EC</option>
              <option value="EE">EE</option>
              <option value="EP">EP</option>
              <option value="ME">ME</option>
              <option value="AE">AE</option>
              <option value="CE">CE</option>
              <option value="CH">CH</option>
              <option value="PE">PE</option>
              <option value="EN">EN</option>
              <option value="BT">BT</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Semester</label>
            <select 
              required
              name="semester" 
              value={formData.semester}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Semester...</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Currently Shown GPA</label>
            <input 
              required
              type="number" 
              step="0.01"
              min="0"
              max="10"
              name="givenGpa" 
              value={formData.givenGpa}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="e.g. 7.54"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Correct Updated GPA</label>
            <input 
              required
              type="number" 
              step="0.01"
              min="0"
              max="10"
              name="updatedGpa" 
              value={formData.updatedGpa}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="e.g. 8.12"
            />
          </div>
        </div>

        {/* File Upload Area */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upload Proof (Marksheet)</label>
          
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' 
                : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            } ${file ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <FileText className="w-10 h-10 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  type="button" 
                  onClick={removeFile}
                  className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 mt-2"
                >
                  <X className="w-4 h-4" /> Remove File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none"
                    >
                      Click to upload
                    </button>
                    {' '}or drag and drop
                  </p>
                  <p className="text-xs text-slate-500 mt-1">PDF, JPG, or PNG (max. 5MB)</p>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
            </>
          ) : (
            'Submit Discrepancy Report'
          )}
        </button>
      </form>
    </div>
  );
}
