import React, { useState, useRef, useEffect } from 'react';
import { Alert } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { CloseIcon } from './icons/CloseIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';

interface ReportIncidentProps {
  onAddAlert: (alert: Omit<Alert, 'id' | 'time'>) => void;
}

const ReportIncident: React.FC<ReportIncidentProps> = ({ onAddAlert }) => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const videoRef = useRef<HTMLVideoElement>(null);

  // Cleanup stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleGetLocation = () => {
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationStatus('success');
      },
      () => {
        setError('Could not get your location. Please enable location services.');
        setLocationStatus('error');
      }
    );
  };

  const handleStartCamera = async () => {
    setError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      handleGetLocation();
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError('Could not access the camera. Please grant camera permissions.');
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
      }
      // Stop the stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };
  
  const handleRetake = () => {
      setImage(null);
      handleStartCamera();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !description.trim()) {
      setError('Please capture a photo and provide a description.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    
    const area = location ? `Lat: ${location.lat.toFixed(4)}, Lon: ${location.lon.toFixed(4)}` : 'Location Reported by User';

    setTimeout(() => {
      onAddAlert({
        type: 'User Report',
        area: area,
        severity: 'High',
        message: description,
        image: image,
      });
    }, 1000);
  };

  const LocationStatusDisplay = () => (
    <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-brand-gray-700 text-sm">
      <LocationMarkerIcon />
      {locationStatus === 'loading' && <span className="text-yellow-400">Fetching location...</span>}
      {locationStatus === 'error' && <span className="text-red-400">Location access denied.</span>}
      {locationStatus === 'success' && location && (
        <span className="text-green-400 font-mono">
          Lat: {location.lat.toFixed(4)}, Lon: {location.lon.toFixed(4)}
        </span>
      )}
    </div>
  );

  return (
    <div className="bg-brand-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-brand-gray-700">
      <h2 className="text-3xl font-bold text-brand-gray-100 mb-6">Report an Incident</h2>
      
      {!stream && !image && (
        <div className="text-center">
            <p className="text-brand-gray-400 mb-6">Capture a live photo of the incident. Your location will be automatically attached.</p>
            <button
                onClick={handleStartCamera}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-blue text-white font-bold rounded-xl shadow-md hover:bg-blue-600 transition-all text-lg"
            >
                <CameraIcon />
                Start Camera
            </button>
        </div>
      )}
      
      {(stream || image) && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-gray-300 mb-2">Live Photo</label>
            <div className="w-full bg-black rounded-lg overflow-hidden aspect-video relative flex items-center justify-center border-2 border-brand-gray-600">
                {stream && <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />}
                {image && <img src={image} alt="Captured incident" className="w-full h-full object-cover" />}
            </div>
            {locationStatus !== 'idle' && <div className="mt-2"><LocationStatusDisplay /></div>}

            <div className="mt-4 flex gap-4">
                {stream && !image && (
                    <button type="button" onClick={handleCapture} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-red-600">
                        Capture Photo
                    </button>
                )}
                 {image && (
                    <button type="button" onClick={handleRetake} className="w-full flex justify-center py-3 px-4 border border-brand-gray-500 rounded-md shadow-sm text-sm font-medium text-white bg-brand-gray-600 hover:bg-brand-gray-500">
                        Retake
                    </button>
                )}
            </div>
          </div>
          
          {image && (
            <>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-brand-gray-300">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue sm:text-sm p-2"
                        placeholder="Describe what you see..."
                        required
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting || !image || !description.trim() || locationStatus !== 'success'}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray-800 focus:ring-brand-blue disabled:bg-brand-gray-600 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </div>
            </>
          )}

          {error && <div className="text-red-400 bg-red-900/40 p-3 rounded-lg text-sm">{error}</div>}
        </form>
      )}
    </div>
  );
};

export default ReportIncident;
