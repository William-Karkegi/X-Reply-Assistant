# X Reply Assistant

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

A browser extension that assists in generating replies on X with various emotions using AI.

## Features

- Generates replies with different emotions (One-Liner, Happy, Agree, Disagree, etc.)
- Uses OpenAI's GPT model for generating responses
- Customizable input for tweet text or questions

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/x-reply-assistant.git
   ```
2. Navigate to the project directory:
   ```
   cd x-reply-assistant
   ```
3. Copy `.env.example` to `.env` and add your OpenAI API key:
   ```
   cp .env.example .env
   ```
4. Open `.env` in a text editor and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
5. Install dependencies:
   ```
   npm install
   ```
6. Build the extension:
   ```
   npm run build
   ```
7. Load the `dist` directory as an unpacked extension in your browser.

## Usage

1. Navigate to X
2. Click on a tweet to reply
3. Use the emotion buttons or custom input to generate a reply

## Contributing

We welcome contributions to the X Reply Assistant! Please see our [Contributing Guide](CONTRIBUTING.md) for more details on how to get started.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). See the [LICENSE](LICENSE) file for details.
