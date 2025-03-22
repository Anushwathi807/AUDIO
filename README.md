# Listening Game Web Application

A mobile-friendly web application for a listening game that includes audio playback, image display, and a series of questions.

## Features

- User registration with name
- Audio playback functionality
- Image display
- Multi-page navigation with back and forward options
- Time tracking for user responses
- Firebase integration for data storage
- Responsive mobile-friendly design

## Files Included

- `index.html` - The main HTML file containing the structure of the web application
- `styles.css` - CSS styling for the mobile web interface
- `app.js` - JavaScript for game logic, navigation, and Firebase integration
- `WhatsApp Audio 2025-03-22 at 1.20.58 PM.mpeg` - Audio file for the listening exercise
- `WhatsApp Image 2025-03-22 at 1.20.58 PM.jpeg` - Image used in the game

## How to Use

1. Open `index.html` in a web browser.
2. Enter your name on the first page and click submit.
3. On the second page, tap the play button to listen to the audio and view the image.
4. Navigate to the next page by clicking the Next button.
5. Answer the question about words related to happiness and submit or proceed to the next page.
6. On the final page, read the evaluation criteria and type your story in the text box.
7. Submit your answers to see results and time taken.

## Firebase Integration

The application uses Firebase for data storage. Each user's responses, including:
- User name
- Happiness words response
- Story response
- Time taken to complete the questions
- Start and end timestamps

are stored in the Firebase Firestore database for later analysis.

## Requirements

- Modern web browser with JavaScript enabled
- Internet connection for Firebase integration

## Customization

You can customize the application by:
- Changing the styling in `styles.css`
- Modifying the questions in `index.html`
- Updating the Firebase configuration in `app.js` if needed 