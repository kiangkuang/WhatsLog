# WhatsLog

A modern web application for viewing and analyzing WhatsApp chat exports with an intuitive, messenger-like interface.

## Demo

🚀 [Try WhatsLog](https://kiangkuang.github.io/WhatsLog/)

## Features

- **Chat Visualization**: View WhatsApp chat exports in a familiar messenger-style interface
- **POV Switching**: Toggle between different participants' perspectives to see messages from their point of view
- **Color-Coded Messages**: Automatically assigns consistent colors to different senders for easy identification
- **Media Support**: Inline images and videos from chat exports

## Installation

```bash
pnpm install
```

## Development

Start the development server with hot-reload:

```bash
pnpm dev
```

The app will be available at `http://localhost:9000`

## Building for Production

Build the optimized production bundle:

```bash
pnpm build
```

The built files will be in the `dist/spa` directory.

## Linting

Run ESLint to check and fix code style:

```bash
pnpm lint
```

## Usage

1. **Load a Chat**: Click the upload button in the top-right corner
2. **Upload Export**: Select a WhatsApp chat export file (`.txt` format) and include media files if available.
3. **View Messages**: Browse through the chat history in a messenger-style interface
4. **Switch Perspective**: Use the POV selector to view the conversation from different participants' perspectives

## Chat Export Format

WhatsLog supports the standard WhatsApp chat export format:

```
[DD/MM/YYYY, HH:MM:SS] Sender Name: Message text
```

To export a chat from WhatsApp:
1. Open the chat
2. Tap the three dots menu (⋮)
3. Select "More" → "Export chat"
4. Choose "Without Media" or "Include Media"
5. Save the exported `.txt` file
6. Upload it to WhatsLog
