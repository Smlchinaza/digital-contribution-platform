"use client";

import { useState, useEffect } from 'react';
import { FiUpload, FiSearch, FiDownload, FiShare2 } from 'react-icons/fi';
import Image from 'next/image';
import AudioPlayer from '../../components/AudioPlayer';
import { toast } from 'react-hot-toast';
import { apiService } from '../../services/api';
import { Sermon } from '../../types/sermon';

export default function SermonsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    preacher: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSermons();
      setSermons(data);
    } catch (error) {
      console.error('Error fetching sermons:', error);
      toast.error('Failed to load sermons');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = async (sermon: Sermon, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiService.incrementSermonDownloadCount(sermon.id);
      const link = document.createElement('a');
      link.href = sermon.audioUrl;
      link.download = `${sermon.title.replace(/\s+/g, '_')}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started!');
    } catch (error) {
      console.error('Error downloading sermon:', error);
      toast.error('Failed to download sermon');
    }
  };

  const handleShare = async (sermon: Sermon, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: sermon.title,
      text: `Check out this sermon: ${sermon.title} by ${sermon.preacher}`,
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast.error('Failed to share. Please try again.');
    }
  };

  const filteredSermons = sermons.filter(sermon =>
    sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sermon.preacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePlay = async (sermonId: number) => {
    if (currentPlaying !== sermonId) {
      try {
        await apiService.incrementSermonPlayCount(sermonId);
      } catch (error) {
        console.error('Error incrementing play count:', error);
      }
    }
    setCurrentPlaying(current => current === sermonId ? null : sermonId);
  };

  const handleEnded = () => {
    setCurrentPlaying(null);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioFile) {
      toast.error('Please select an audio file');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('preacher', uploadForm.preacher);
      formData.append('description', uploadForm.description);
      formData.append('date', uploadForm.date);
      formData.append('duration', uploadForm.duration);
      formData.append('audio', audioFile);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await apiService.createSermon(formData, (progress) => {
        setUploadProgress(progress);
      });
      toast.success('Sermon uploaded successfully!');
      setShowUploadModal(false);
      // Reset form
      setUploadForm({
        title: '',
        preacher: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        duration: '',
      });
      setAudioFile(null);
      setImageFile(null);
      setUploadProgress(0);
      // Refresh sermons list
      fetchSermons();
    } catch (error) {
      console.error('Error uploading sermon:', error);
      toast.error('Failed to upload sermon');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070b] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Sermons</h1>
          <p className="text-lg text-white/70">Listen to our latest messages and grow in faith</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-white/50" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Search sermons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setShowUploadModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
          >
            <FiUpload className="h-5 w-5" />
            Upload Sermon
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-white/70">Loading sermons...</p>
          </div>
        )}

        {/* Sermons Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSermons.map((sermon) => (
              <div key={sermon.id} className="rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition-colors">
                <div className="relative h-48 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10">
                  {sermon.imageUrl ? (
                    <Image
                      src={sermon.imageUrl}
                      alt={sermon.title}
                      fill
                      className="object-cover opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white/30 text-4xl">🎵</span>
                    </div>
                  )}
                <button
                  onClick={() => togglePlay(sermon.id)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label={currentPlaying === sermon.id ? 'Pause sermon' : 'Play sermon'}
                >
                  {currentPlaying === sermon.id ? (
                    <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-8 w-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                {currentPlaying === sermon.id && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <AudioPlayer 
                      src={sermon.audioUrl} 
                      isPlaying={true}
                      onPlayPause={() => togglePlay(sermon.id)}
                      onEnded={handleEnded}
                    />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold mb-1 truncate">{sermon.title}</h3>
                    <p className="text-white/70 truncate">{sermon.preacher}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button 
                      onClick={(e) => handleDownload(sermon, e)}
                      className="p-2 text-white/70 hover:text-cyan-400 transition-colors"
                      aria-label="Download sermon"
                      title="Download"
                    >
                      <FiDownload className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={(e) => handleShare(sermon, e)}
                      className="p-2 text-white/70 hover:text-emerald-400 transition-colors"
                      aria-label="Share sermon"
                      title="Share"
                    >
                      <FiShare2 className="h-5 w-5" />
                    </button>
                    <span className="text-sm text-white/50 whitespace-nowrap ml-1">
                      {sermon.duration}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-sm text-white/60">
                  {new Date(sermon.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {!loading && filteredSermons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70">No sermons found. Please try a different search term.</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0f1a] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Upload Sermon</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter sermon title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preacher *</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.preacher}
                    onChange={(e) => setUploadForm({ ...uploadForm, preacher: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter preacher name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter sermon description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date *</label>
                    <input
                      type="date"
                      required
                      value={uploadForm.date}
                      onChange={(e) => setUploadForm({ ...uploadForm, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <input
                      type="text"
                      value={uploadForm.duration}
                      onChange={(e) => setUploadForm({ ...uploadForm, duration: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g., 45:30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Audio File *</label>
                  <input
                    type="file"
                    accept="audio/*"
                    required
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:text-white file:cursor-pointer hover:file:bg-emerald-600"
                  />
                  {audioFile && <p className="text-sm text-white/70 mt-2">Selected: {audioFile.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-white file:cursor-pointer hover:file:bg-cyan-600"
                  />
                  {imageFile && <p className="text-sm text-white/70 mt-2">Selected: {imageFile.name}</p>}
                </div>

                {/* Upload Progress Bar */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Uploading...</span>
                      <span className="text-emerald-400 font-medium">{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload Sermon'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
