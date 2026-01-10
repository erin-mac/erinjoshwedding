# Audio File Instructions

To enable the persistent background music:

1. Choose your wedding song or background music
2. Convert it to MP3 format if it isn't already
3. Name the file `wedding-song.mp3`
4. Place it in this `audio` directory

The music will:
- Start playing when a user clicks the "Play Music" button
- Continue playing as they navigate between pages
- Remember the playback position across page loads
- Loop continuously
- Play at 50% volume (adjustable in the code)

## Recommended Settings
- Format: MP3
- Bitrate: 128-192 kbps (good quality, reasonable file size)
- Length: Full song or instrumental version

## Alternative
If you want to use a different filename, edit line 18 in `js/persistent-audio.js`:
```javascript
audio.src = 'audio/your-filename.mp3';
```
