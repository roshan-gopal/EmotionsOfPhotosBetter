import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { HumeClient } from 'hume';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  secure_url: string;
  info?: {
    detection?: {
      faces?: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
      }>;
    };
  };
}

async function validateImageUrl(uploadedImageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(uploadedImageUrl);
    const contentType = response.headers.get('content-type');
    return contentType?.startsWith('image/') ?? false;
  } catch (err) {
    console.error('URL validation error:', err);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    console.log("Request received");
    const formData = await request.formData();
    console.log("formData", formData);
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const bytes = await (file as Blob).arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with face blurring transformation
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'auto',
            transformation: [
              {
                quality: "auto:best",
                effect: "blur_faces:20", // Face detection and blurring
                face_coordinates: true // Request face detection data
              }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result as CloudinaryUploadResult);
          }
        )
        .end(buffer);
    });

    // Extract face detection information
    const faceInfo = result.info?.detection?.faces || [];
    console.log("Face detection info:", faceInfo);

    // Perform emotional analysis using Hume
    const imageUrl = result.secure_url;
    const isValidImage = await validateImageUrl(imageUrl);
    
    if (!isValidImage) {
      return NextResponse.json(
        { error: "Invalid image URL or image not accessible" },
        { status: 400 }
      );
    }

    const apiKey = process.env.HUME_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "HUME_API_KEY is required" },
        { status: 500 }
      );
    }

    const hume = new HumeClient({
      apiKey: apiKey,
    });

    const job = await hume.expressionMeasurement.batch.startInferenceJob({
      models: {
        face: {},
      },
      urls: [imageUrl],
    });

    await job.awaitCompletion();
    const predictions = await hume.expressionMeasurement.batch.getJobPredictions(job.jobId);

    return NextResponse.json({ 
      url: result.secure_url,
      faces: faceInfo,
      predictions: predictions
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Error processing image' },
      { status: 500 }
    );
  }
}
