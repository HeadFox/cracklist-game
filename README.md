# 📸 Google Photos Live Converter

A web app to review and convert Google Photos Live Photos (Motion Photos) to still images. Helps you manage your photo library by deciding which Live Photos to keep and which to convert to regular photos.

## ✨ Features

- **Automatic Detection**: Fetches all Live Photos from your Google Photos library
- **Review Interface**: Play the motion for each photo before deciding
- **Batch Processing**: Convert multiple photos at once
- **Keyboard Shortcuts**: Quick navigation and decisions
- **Progress Tracking**: See which photos you've reviewed
- **Secure**: Uses official Google OAuth 2.0 - your credentials stay private

## 🚀 Quick Start

### Prerequisites

1. **Google Cloud Project Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the **Google Photos Library API**
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Your production URL (e.g., `https://yourusername.github.io`)
   - Add authorized redirect URIs:
     - `http://localhost:5173` (for development)
     - Your production URL

2. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env and add your Google Client ID
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🎯 How It Works

### 1. Login
- Sign in with your Google account
- Grant access to Google Photos (read and write permissions)

### 2. Loading
- The app fetches all your photos
- Identifies Live Photos (photos with both image and video components)
- Shows progress as it scans your library

### 3. Gallery View
- See all your Live Photos in a grid
- Track which ones you've reviewed
- View statistics (keep vs. convert)

### 4. Review
- Play the motion of each Live Photo
- Decide for each photo:
  - **Keep Live**: No changes, preserves motion
  - **Convert**: Upload as still image, save space
  - **Skip**: Decide later

### 5. Processing
- Converts selected photos to still images
- Uploads new still images to Google Photos
- Shows progress and results
- **Note**: Original Live Photos must be deleted manually (API limitation)

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` | Navigate between photos |
| `Space` | Play/Pause motion |
| `K` | Keep as Live Photo |
| `C` | Convert to Still Image |
| `S` | Skip for now |

## 🛠️ Tech Stack

- **React 19** + **TypeScript** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **@react-oauth/google** - Google authentication
- **Axios** - HTTP client
- **Google Photos Library API** - Photo access

## 📦 Project Structure

```
src/
├── components/
│   ├── Login.tsx         # Authentication screen
│   ├── Loading.tsx       # Photo loading screen
│   ├── Gallery.tsx       # Photo grid view
│   ├── Review.tsx        # Individual photo review
│   ├── Processing.tsx    # Conversion progress
│   └── Error.tsx         # Error handling
├── store/
│   └── photoStore.ts     # Zustand state management
├── types/
│   └── photos.ts         # TypeScript definitions
├── utils/
│   └── googlePhotosApi.ts # Google Photos API client
└── App.tsx               # Main app router
```

## 🔒 Security & Privacy

- **No data storage**: All data stays in your browser
- **Direct API calls**: Communicates directly with Google Photos
- **OAuth 2.0**: Industry-standard authentication
- **Read-only by default**: Only writes when you choose to convert
- **Open source**: Review the code yourself

## ⚠️ Important Notes

### API Limitations

1. **No Direct Deletion**: Google Photos Library API doesn't support deleting photos programmatically. After conversion, you must manually delete the original Live Photos from your Google Photos library.

2. **Rate Limits**: Free tier allows 10,000 requests per day. Large libraries may take time to load.

3. **Live Photo Detection**: Live Photos are identified by having both `photo` and `video` metadata. Some motion photos may not be detected if metadata is missing.

4. **Album Associations**: Converted photos won't automatically be added to the same albums as originals. You'll need to manually organize them.

### Best Practices

- Review photos in batches (e.g., 50-100 at a time)
- Keep track of which originals you've deleted manually
- Back up important photos before conversion
- Test with a few photos first before processing many

## 🌐 Deployment

### GitHub Pages

1. Update `vite.config.ts` base URL if needed
2. Set up environment variables in GitHub Secrets:
   - `VITE_GOOGLE_CLIENT_ID`
3. Push to main branch - GitHub Actions will deploy automatically

### Other Platforms

- **Vercel**: Connect repository and add environment variables
- **Netlify**: Same process as Vercel
- **Custom Server**: Build and serve the `dist` folder

## 🐛 Troubleshooting

### "Failed to authenticate"
- Check that your Google Client ID is correct
- Verify authorized origins and redirect URIs in Google Cloud Console
- Make sure Google Photos Library API is enabled

### "No Live Photos found"
- Ensure you actually have motion photos in your library
- Some phones save them differently - check your device settings

### "Failed to load photos"
- Check your internet connection
- Verify API is enabled in Google Cloud Console
- Check browser console for detailed error messages

## 📝 Development

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Google Photos Library API documentation
- React and Vite communities
- Open source contributors

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review Google Photos API documentation

---

**Note**: This is an independent project and is not officially associated with or endorsed by Google.
