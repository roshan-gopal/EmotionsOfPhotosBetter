"use client"

import { HumeClient } from 'hume';
import { useState, useEffect } from 'react';
import styles from './MainPage.module.css';  // We'll create this next
import { PlusCircle, ImagePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import Graph from './graph';

// Add this interface near the top of the file with other imports
interface Emotion { 
  name: string;
  score: number;
  color: string;
}

export default function MainPage() {
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prediction_final, setPredictionFinal] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [progressValues, setProgressValues] = useState<{ [key: string]: number }>({});
  const [imageOrientation, setImageOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Create a new image object to check dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        // Set orientation based on image dimensions
        setImageOrientation(img.width >= img.height ? 'horizontal' : 'vertical');
        URL.revokeObjectURL(objectUrl); // Clean up
      };
      img.src = objectUrl;
      
      // Reset states immediately when new file is selected
      setPredictions(null);
      setPredictionFinal(null);
      setError(null);
      setLoading(true);
      
      setSelectedFile(file);
      setLocalImageUrl(URL.createObjectURL(file));  // Create local URL for preview
      
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        setUploadedImageUrl(data.url);
        setPredictions(data.predictions);
        setPredictionFinal(JSON.stringify(data.predictions, null, 2));
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Make visible after a short delay to ensure mount
    setIsVisible(true);
  }, []);

  // Transform emotions data for the chart - modified to get only top 3
  const getEmotionsData = (predictions: any) => {
    if (!predictions?.[0]?.results?.predictions[0]?.models?.face?.groupedPredictions[0]?.predictions[0]?.emotions) {
      return [];
    }
    
    const emotions = predictions[0].results.predictions[0].models.face.groupedPredictions[0].predictions[0].emotions
      .map((emotion: any) => ({
        name: emotion.name,
        score: parseFloat((emotion.score * 100).toFixed(1)),
        color: 
          emotion.name === 'Admiration' ? '#4169E1' : // Royal Blue
          emotion.name === 'Adoration' ? '#32CD32' : // Lime Green
          emotion.name === 'Appreciation' ? '#FFD700' : // Gold
          emotion.name === 'Amusement' ? '#FF8C00' : // Dark Orange
          emotion.name === 'Anger' ? '#FF4500' : // Orange Red
          emotion.name === 'Anxiety' ? '#8B4513' : // Saddle Brown
          emotion.name === 'Awe' ? '#4B0082' : // Indigo
          emotion.name === 'Awkwardness' ? '#808000' : // Olive
          emotion.name === 'Boredom' ? '#696969' : // Dim Gray
          emotion.name === 'Calmness' ? '#40E0D0' : // Turquoise
          emotion.name === 'Concentration' ? '#483D8B' : // Dark Slate Blue
          emotion.name === 'Confusion' ? '#8B008B' : // Dark Magenta
          emotion.name === 'Contemplation' ? '#2F4F4F' : // Dark Slate Gray
          emotion.name === 'Contempt' ? '#800000' : // Maroon
          emotion.name === 'Contentment' ? '#228B22' : // Forest Green
          emotion.name === 'Craving' ? '#B8860B' : // Dark Goldenrod
          emotion.name === 'Desire' ? '#8B0000' : // Dark Red
          emotion.name === 'Determination' ? '#006400' : // Dark Green
          emotion.name === 'Disappointment' ? '#9370DB' : // Medium Purple
          emotion.name === 'Disgust' ? '#556B2F' : // Dark Olive Green
          emotion.name === 'Distress' ? '#B22222' : // Fire Brick
          emotion.name === 'Doubt' ? '#5F9EA0' : // Cadet Blue
          emotion.name === 'Ecstasy' ? '#9932CC' : // Dark Orchid
          emotion.name === 'Embarrassment' ? '#8FBC8F' : // Dark Sea Green
          emotion.name === 'Empathic Pain' ? '#E6B800' : // Dark Yellow
          emotion.name === 'Entrancement' ? '#008080' : // Teal
          emotion.name === 'Envy' ? '#3CB371' : // Medium Sea Green
          emotion.name === 'Excitement' ? '#FF6B6B' : // Light Coral
          emotion.name === 'Fear' ? '#800080' : // Purple
          emotion.name === 'Guilt' ? '#BC8F8F' : // Rosy Brown
          emotion.name === 'Horror' ? '#A0522D' : // Sienna
          emotion.name === 'Interest' ? '#00CED1' : // Dark Turquoise
          emotion.name === 'Joy' ? '#FFA500' : // Orange
          emotion.name === 'Love' ? '#FF1493' : // Deep Pink
          emotion.name === 'Nostalgia' ? '#DEB887' : // Burlywood
          emotion.name === 'Pain' ? '#CD853F' : // Peru
          emotion.name === 'Pride' ? '#DAA520' : // Goldenrod
          emotion.name === 'Realization' ? '#20B2AA' : // Light Sea Green
          emotion.name === 'Relief' ? '#66CDAA' : // Medium Aquamarine
          emotion.name === 'Romance' ? '#FF69B4' : // Hot Pink
          emotion.name === 'Sadness' ? '#6495ED' : // Cornflower Blue
          emotion.name === 'Satisfaction' ? '#2E8B57' : // Sea Green
          emotion.name === 'Shame' ? '#778899' : // Light Slate Gray
          emotion.name === 'Surprise (negative)' ? '#CD5C5C' : // Indian Red
          emotion.name === 'Surprise (positive)' ? '#98FB98' : // Pale Green
          emotion.name === 'Sympathy' ? '#48D1CC' : // Medium Turquoise
          emotion.name === 'Tiredness' ? '#4682B4' : // Steel Blue
          emotion.name === 'Triumph' ? '#FFE4B5' : // Moccasin
          '#3b82f6' // Default Blue
      }))
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 3);

    console.log("Processed emotions data:", emotions);
    return emotions;
  };

  useEffect(() => {
    if (predictions) {
      const emotions = getEmotionsData(predictions);
      const newProgress: { [key: string]: number } = {};
      emotions.forEach((emotion: Emotion) => {
        newProgress[emotion.name] = 0;
      });
      setProgressValues(newProgress);

      // Animate progress values without the 95% cap
      setTimeout(() => {
        const finalProgress: { [key: string]: number } = {};
        emotions.forEach((emotion: Emotion) => {
          finalProgress[emotion.name] = emotion.score;  // Removed Math.min(emotion.score, 95)
        });
        setProgressValues(finalProgress);
      }, 100);
    }
  }, [predictions]);

  return (
    <div className={styles.container}>
      <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
        <h1 className="text-2xl font-bold mb-4 md:text-left text-center px-4 md:px-0">
          <span 
            className={`${styles.slideIn} md:inline block mb-2 md:mb-0`} 
            style={{ transitionDelay: '0.2s' } as any}
          >
            Taking a photo is hard.
          </span>
          <span 
            className={`${styles.slideIn} md:inline block mb-2 md:mb-0`} 
            style={{ transitionDelay: '1.7s' } as any}
          >
            Choosing the best one is harder.
          </span>
          <span 
            className={`${styles.slideIn} md:inline block`} 
            style={{ transitionDelay: '3.2s' } as any}
          >
            Figure out what emotions your pictures are giving.
          </span>
        </h1>
        
        <div className="mb-6 relative flex flex-col items-center gap-4">
          {!localImageUrl && (
            <div className={`${styles.initialUploadSection} ${isVisible ? styles.visible : ''}`}>
              <span className={styles.uploadText}>UPLOAD PHOTO</span>
              <div 
                onClick={() => document.getElementById('fileInput')?.click()}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer transition-all shadow-lg hover:shadow-xl"
              >
                <ImagePlus size={200} color="black" />
              </div>
            </div>
          )}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.hiddenInput}
          />
          
          {localImageUrl && (
            <>
              <div className={`${styles.analysisLayout} flex flex-col md:flex-row items-center justify-center gap-8 w-full`}>
                <div className={`${styles.imageSection} ${imageOrientation === 'vertical' ? styles.verticalContainer : ''}`}>
                  <img 
                    src={localImageUrl} 
                    alt="Uploaded image"
                    className={`
                      ${styles.uploadedImage} 
                      ${imageOrientation === 'vertical' ? styles.verticalImage : styles.horizontalImage}
                      rounded-lg border-2 border-white/30 
                      transform transition-all duration-300 
                      ease-in-out hover:border-white/70 
                      hover:shadow-2xl hover:scale-105 
                      hover:brightness-110 object-contain
                      md:max-w-[600px] md:max-h-[400px]
                    `}
                  />
                  {loading && (
                    <div className={styles.spinnerContainer}>
                      <div className={styles.spinner}></div>
                      <p className={styles.loadingText}>Finding your emotions...</p>
                    </div>
                  )}
                </div>

                {!loading && predictions && (
                  <motion.div 
                    className={`${styles.analysisSection} w-full md:w-[400px] mx-auto md:mx-0 p-2 md:p-4 backdrop-blur-md bg-white/10 rounded-xl border border-white/20 shadow-xl flex flex-col items-center justify-center`}
                  >
                    <h2 
                      style={{
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: '400',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        marginBottom: '1rem',
                        textAlign: 'center',
                        width: '100%'
                      }}
                    >
                      You're Giving Off...
                    </h2>
                    
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '1rem',
                      marginBottom: '1rem', 
                      backgroundColor: 'transparent',
                      padding: '0.5rem',
                      width: '100%',
                      alignItems: 'center'
                    }}>
                      {getEmotionsData(predictions).map((emotion: Emotion, index: number) => {
                        console.log("Mapping emotion:", emotion);
                        return (
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            className="flex-col md:flex-row active:scale-105 transition-transform touch-pan-y"
                          >
                            <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                      
                              style={{
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: '300',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 1.05 }}
                              className="text-center mb-1 md:mb-0 active:opacity-80 transition-opacity"
                            >
                              {emotion.name}
                            </motion.div>

                            <motion.div
                              style={{ 
                                width: '100%',
                                maxWidth: '10rem',
                                height: '1.5rem',
                                backgroundColor: 'transparent',
                                borderRadius: '0.5rem',
                                border: '2px solid black',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 1.1 }}
                            >
                             
                              <motion.div
                                initial={{ opacity: 0 }}
                                
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '1.2rem',
                                  fontWeight: '500',
                                  letterSpacing: '0.15em',
                                  textTransform: 'uppercase',
                                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                                  zIndex: 2,
                                  fontFamily: 'system-ui, -apple-system, sans-serif',
                                }}
                                whileHover={{ opacity: 1 }}
                                whileTap={{ opacity: 1 }}
                              >
                                {emotion.score.toFixed(1)}%
                              </motion.div>
                              
                              <div
                                style={{
                                  position: 'absolute',
                                  left: 0,
                                  top: 0,
                                  height: '100%',
                                  width: `${progressValues[emotion.name] || 0}%`,
                                  backgroundColor: emotion.color,
                                  transition: 'width 1s ease-in-out',
                                  opacity: 1
                                }}
                              />
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>

              {!loading && predictions && (
                <div className={styles.smallUploadSection}>
                  <span className={styles.smallUploadText}>TRY ANOTHER PHOTO</span>
                  <div 
                    onClick={() => document.getElementById('fileInput')?.click()}
                    className={styles.uploadButton}
                  >
                    <ImagePlus size={200} color="black" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {error && <p className="text-red-500">Error: {error}</p>}
      </div>
    </div>
  );
}

