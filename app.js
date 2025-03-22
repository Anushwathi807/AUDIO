// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_cZlbXlVu6JI1qK-G1bVvNooUh7i5tpg",
  authDomain: "manual-7fb6a.firebaseapp.com",
  projectId: "manual-7fb6a",
  storageBucket: "manual-7fb6a.firebasestorage.app",
  messagingSenderId: "965602923974",
  appId: "1:965602923974:web:05b2a2190c767af4118ec7",
  measurementId: "G-BDC6W32ETS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const analytics = firebase.analytics();

// Game state variables
let userName = '';
let startTime = null;
let endTime = null;
let userAnswers = {
    happinessWords: '',
    story: ''
};

// DOM Elements
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');
const page4 = document.getElementById('page4');
const resultPage = document.getElementById('resultPage');
const nameForm = document.getElementById('nameForm');
const userNameInput = document.getElementById('userName');
const userNameDisplay = document.getElementById('userNameDisplay');
const gameAudio = document.getElementById('gameAudio');
const playButton = document.getElementById('playButton');
const happinessWordsInput = document.getElementById('happinessWords');
const storyAnswer = document.getElementById('storyAnswer');
const timeTakenSpan = document.getElementById('timeTaken');
const userAnswersDiv = document.getElementById('userAnswers');

// Navigation buttons
const nextToPage3 = document.getElementById('nextToPage3');
const prevToPage2 = document.getElementById('prevToPage2');
const nextToPage4 = document.getElementById('nextToPage4');
const prevToPage3 = document.getElementById('prevToPage3');
const submitFinal = document.getElementById('submitFinal');

// Helper function to stop audio
function stopAudio() {
    if (!gameAudio.paused) {
        gameAudio.pause();
        gameAudio.currentTime = 0; // Reset audio position
    }
    playButton.textContent = 'Play Audio';
}

// Event Listeners
nameForm.addEventListener('submit', function(e) {
    e.preventDefault();
    userName = userNameInput.value.trim();
    
    if (userName) {
        // Navigate to page 2
        page1.style.display = 'none';
        page2.style.display = 'flex';
        
        // Select random emojis for a fun greeting
        const emojis = ['😊', '🎵', '🎧', '🎶', '👋', '✨', '🌈', '🥳'];
        const randomEmoji1 = emojis[Math.floor(Math.random() * emojis.length)];
        const randomEmoji2 = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Display user name with greeting and emojis
        userNameDisplay.innerHTML = `Hi!!! ${userName} <span class="emoji">${randomEmoji1}${randomEmoji2}</span>`;
    }
});

// Audio player
playButton.addEventListener('click', function() {
    if (gameAudio.paused) {
        gameAudio.play();
        playButton.textContent = 'Pause Audio';
    } else {
        gameAudio.pause();
        playButton.textContent = 'Play Audio';
    }
});

// Reset the button text when audio ends
gameAudio.addEventListener('ended', function() {
    playButton.textContent = 'Play Audio';
});

// Navigation: Page 2 to Page 3
nextToPage3.addEventListener('click', function() {
    // Stop audio if it's playing when navigating away
    stopAudio();
    
    page2.style.display = 'none';
    page3.style.display = 'flex';
    
    // Start timing when user reaches question page
    startTime = new Date();
});

// Navigation: Page 3 to Page 2
prevToPage2.addEventListener('click', function() {
    page3.style.display = 'none';
    page2.style.display = 'flex';
    
    // Reset play button text in case the audio was playing before
    stopAudio();
});

// Navigation: Page 3 to Page 4
nextToPage4.addEventListener('click', function() {
    const answer = happinessWordsInput.value.trim();
    
    if (answer && answer.toLowerCase() !== 'nil') {
        userAnswers.happinessWords = answer;
        
        // Stop audio if it's somehow still playing
        stopAudio();
        
        page3.style.display = 'none';
        page4.style.display = 'flex';
    } else {
        alert('Please enter a valid answer. "Nil" or empty answers are not accepted.');
        happinessWordsInput.focus();
    }
});

// Navigation: Page 4 to Page 3
prevToPage3.addEventListener('click', function() {
    // Stop audio if it's somehow still playing
    stopAudio();
    
    page4.style.display = 'none';
    page3.style.display = 'flex';
});

// Submit final answers
submitFinal.addEventListener('click', function() {
    const story = storyAnswer.value.trim();
    const validationMessage = document.querySelector('.validation-message');
    
    if (story) {
        userAnswers.story = story;
        
        // End timing
        endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000; // Convert to seconds
        
        // Make sure audio is stopped if it was playing
        stopAudio();
        
        // Display result page
        page4.style.display = 'none';
        resultPage.style.display = 'flex';
        
        // Display time taken
        timeTakenSpan.textContent = formatTime(timeTaken);
        
        // Display user answers
        userAnswersDiv.innerHTML = `
            <p><strong>Happiness Words:</strong> ${userAnswers.happinessWords}</p>
            <p><strong>Story:</strong><br>${userAnswers.story}</p>
        `;
        
        // Save data to Firebase
        saveToFirebase(userName, userAnswers, timeTaken);
    } else {
        // Show validation message
        if (validationMessage) {
            validationMessage.style.opacity = '1';
            setTimeout(() => {
                validationMessage.style.opacity = '0';
            }, 3000);
        }
        storyAnswer.focus();
    }
});

// Helper function to format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes} minutes and ${secs} seconds`;
}

// Save data to Firebase
function saveToFirebase(userName, answers, timeTaken) {
    db.collection("gameResponses").add({
        userName: userName,
        happinessWords: answers.happinessWords,
        story: answers.story,
        timeTaken: timeTaken,
        startTime: startTime,
        endTime: endTime,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
        
        // Fallback to local storage if Firebase fails
        storeDataLocally(userName, answers, timeTaken);
    });
}

// Fallback: Store data locally
function storeDataLocally(userName, answers, timeTaken) {
    const gameData = {
        userName: userName,
        happinessWords: answers.happinessWords,
        story: answers.story,
        timeTaken: timeTaken,
        startTime: startTime.toString(),
        endTime: endTime.toString(),
        timestamp: new Date().toString()
    };
    
    // Store in localStorage
    try {
        const existingData = JSON.parse(localStorage.getItem('gameResponses') || '[]');
        existingData.push(gameData);
        localStorage.setItem('gameResponses', JSON.stringify(existingData));
        console.log('Data stored locally (Firebase fallback)');
    } catch (error) {
        console.error('Error storing data locally:', error);
    }
}

// Stop audio when user leaves the page or refreshes
window.addEventListener('beforeunload', function() {
    stopAudio();
}); 