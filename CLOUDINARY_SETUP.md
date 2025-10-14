# Cloudinary Audio Player Integration

This guide explains how to set up and use the Cloudinary integration for sermon audio files.

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. Once logged in, go to your Dashboard
3. You'll find your credentials:
   - Cloud Name
   - API Key
   - API Secret

### 2. Configure Backend Environment Variables

Create a `.env` file in `apps/backend/` with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT
JWT_SECRET="your-secret-key-here"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Replace the Cloudinary values with your actual credentials from the Cloudinary dashboard.

### 3. Run Database Migration

Run the Prisma migration to create the Sermon table:

```bash
cd apps/backend
npx prisma migrate dev --name add_sermon_model
npx prisma generate
```

### 4. Start the Backend Server

```bash
cd apps/backend
npm run start:dev
```

### 5. Start the Frontend

```bash
cd apps/frontend
npm run dev
```

## Features

### Backend API Endpoints

- **GET /sermons** - Get all sermons
- **GET /sermons/:id** - Get a specific sermon
- **POST /sermons** - Upload a new sermon (requires authentication)
  - Accepts multipart/form-data with:
    - `audio` (required): Audio file (MP3)
    - `image` (optional): Thumbnail image
    - `title`, `preacher`, `date`, `description`, `duration`
- **PATCH /sermons/:id** - Update a sermon (requires authentication)
- **DELETE /sermons/:id** - Delete a sermon (requires authentication)
- **POST /sermons/:id/play** - Increment play count
- **POST /sermons/:id/download** - Increment download count

### Frontend Features

- **Audio Player**: Custom audio player with Cloudinary URLs
- **Search**: Search sermons by title or preacher
- **Download**: Download sermons with tracking
- **Share**: Share sermons via Web Share API or clipboard
- **Play Tracking**: Automatically tracks play counts
- **Responsive Design**: Works on all devices

### Audio Player Component

The `AudioPlayer` component automatically works with Cloudinary URLs:
- Supports streaming from Cloudinary
- Volume control
- Progress bar with seek functionality
- Play/pause controls
- Time display

## Usage

### Uploading a Sermon

To upload a sermon, you need to be authenticated as an admin. Use a tool like Postman or create a frontend upload form:

```javascript
const formData = new FormData();
formData.append('title', 'The Power of Faith');
formData.append('preacher', 'Rev. John Doe');
formData.append('date', '2024-10-14');
formData.append('description', 'An inspiring message about faith');
formData.append('duration', '45:22');
formData.append('audio', audioFile); // File object
formData.append('image', imageFile); // File object (optional)

await apiService.createSermon(formData);
```

### Playing a Sermon

The frontend automatically handles sermon playback:
1. Click on any sermon card
2. The audio player appears with the Cloudinary audio URL
3. Play counts are automatically tracked

### Cloudinary Benefits

- **CDN Delivery**: Fast audio streaming worldwide
- **Automatic Optimization**: Cloudinary optimizes audio files
- **Scalability**: No server storage needed
- **Reliability**: 99.9% uptime SLA
- **Analytics**: Track usage through Cloudinary dashboard

## File Structure

```
apps/
├── backend/
│   └── src/
│       └── sermons/
│           ├── cloudinary.service.ts    # Cloudinary upload/delete logic
│           ├── sermons.controller.ts    # API endpoints
│           ├── sermons.service.ts       # Business logic
│           ├── sermons.module.ts        # Module definition
│           └── dto/
│               ├── create-sermon.dto.ts
│               └── update-sermon.dto.ts
└── frontend/
    └── src/
        ├── app/sermons/page.tsx         # Sermons page
        ├── components/AudioPlayer.tsx    # Audio player component
        ├── services/api.ts               # API service with sermon methods
        └── types/sermon.ts               # Sermon type definition
```

## Troubleshooting

### Audio Not Playing
- Check that the Cloudinary URL is accessible
- Verify CORS settings in Cloudinary dashboard
- Check browser console for errors

### Upload Fails
- Verify Cloudinary credentials in `.env`
- Check file size limits (Cloudinary free tier has limits)
- Ensure audio file is in supported format (MP3, WAV, etc.)

### Database Errors
- Run `npx prisma migrate dev` to ensure schema is up to date
- Check DATABASE_URL in `.env`

## Next Steps

- Add upload form in frontend for admins
- Implement sermon categories/tags
- Add sermon series grouping
- Implement audio transcription
- Add sermon notes/study guides
