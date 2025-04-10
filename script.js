//Variable decalration through ids for song selection on bottom bar

let Satranga = document.getElementById("SatrangaSong");
let Sajni = document.getElementById("SajniSong");
let Soulmate = document.getElementById("SoulmateSong");
let Challeya = document.getElementById("ChalleyaSong");
let OMahi = document.getElementById("OMahiSong");
let BottomSongBar = document.getElementById("songFunctioning");

//below is separate from above
let playButtonHTML = '<div><img src="images/playButton.png" alt="#" id="SongPlayButton"></div>';
let isSelected = false;



// Get all song bars and numbers
let songbars = document.getElementsByClassName("Songs");
let numbers = document.getElementsByClassName("Number");
console.log(songbars);

// Loop through each songbar
for (let i = 0; i < songbars.length; i++) {
    // Add event listeners for mouseenter and mouseleave
    songbars[i].addEventListener("mouseenter", () => {
        numbers[i].innerHTML = playButtonHTML;
        songbars[i].style = "background-color:#80808069";
        if (isSelected) {
            songbars[i].style = "background-color:gray ";
        }

    });

    songbars[i].addEventListener("mouseleave", () => {
        numbers[i].textContent = i + 1;
        songbars[i].style = "";
        // if (!isSelected) {
        //     songbars[i].style = "background-color:burlywood";  
        // }
        if (isSelected) {
            songbars[i].style = "background-color: #554E49 ";
        }
        isSelected = false;
    });
}



let isDragging = false;

// Handle mouse move event
// Handle mouse up event
window.addEventListener('mouseup', () => {
    isDragging = false;
});

// logic for  background color in song selection

// const a = 0;
for (let i = 0; i < songbars.length; i++) {
    if (!isSelected) {
        songbars[i].addEventListener("click", () => {
            // Set all songbars to burlywood(burlywood color is removed31/march/2025) first
            for (let j = 0; j < songbars.length; j++) {
                songbars[j].style.backgroundColor = "";
            }

            // Then set the clicked songbar to gray
            songbars[i].style.backgroundColor = " #554E49";
            isSelected = true;
        });
    }
}


//final button play song script

let buttonValue = false;
let songPlay = false;
let finalButtonPlaySong = null;
let audioPlayer = null;
let currentSongName = ''; // Add this to track current song




//function for textchanger and song change in bottom bar
function SongChanger(imageName, songHeading, songParagraph, songName) {
    // Update HTML
    BottomSongBar.innerHTML = `<div id="left">
        <img src="images/${imageName}.JPG" alt="#" id="img1">
        <div id="songContent">
            <h4>${songHeading}</h4>
            <p>${songParagraph}</p>
        </div>
        <img src="images/plus.png" alt="#" id="img2">
    </div>
    <div id="center">
        <div id="buttonsContainer">
            <img src="images/playButton.png" alt="#">
        </div>
        <div id="timelineContainer">
            <div id="timelineBarContainer">
                <div id="timelineBar"></div>
            </div>
   
        </div>
    </div>
    <div id="right">
        <img src="images/speaker-with-three-sound-waves.256x243.png" alt="#" id="speaker-icon">
        <div id="volumeBarContainer">
            <div id="volumeBar"></div>
        </div>
    </div>`;

    // Get fresh references
    finalButtonPlaySong = document.getElementById("buttonsContainer");
    audioPlayer = document.getElementById("audioPlayer");
    const volumeBar = document.getElementById('volumeBar');
    const volumeBarContainer = document.getElementById('volumeBarContainer');
    const speakerButton = document.getElementById("speaker-icon");
    const timelineBar = document.getElementById("timelineBar");

    // Only set audio source if it's a different song
    if (currentSongName !== songName) {
        audioPlayer.src = `Songs/${songName}.mp3`;
        currentSongName = songName;
        buttonValue = false; // Reset button state for new song
    }

    // Play/Pause button functionality
    finalButtonPlaySong.addEventListener("click", () => {
        if (!buttonValue) {
            finalButtonPlaySong.innerHTML = `<img src="images/Newpause.164x256.png" alt="#">`;
            audioPlayer.play();
            buttonValue = true;
            songPlay = true;
            songTimeLine(1000);
        } else {
            finalButtonPlaySong.innerHTML = `<img src="images/playButton.png" alt="#">`;
            audioPlayer.pause();
            buttonValue = false;
        }
    });

    // Volume control
    function updateVolume(e) {
        const rect = volumeBarContainer.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        offsetX = Math.max(0, Math.min(offsetX, rect.width));
        const volume = offsetX / rect.width;
        volumeBar.style.width = volume * 100 + '%';
        audioPlayer.volume = volume;
    }

    volumeBarContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateVolume(e);
    });

    // Speaker button functionality
    let speakerButtonValue = false;
    let lastMusicVolume = audioPlayer.volume;

    speakerButton.addEventListener("click", () => {
        if (!speakerButtonValue) {
            speakerButton.src = "images/speaker.151x256.png";
            lastMusicVolume = audioPlayer.volume;
            audioPlayer.volume = 0;
            speakerButtonValue = true;
        } else {
            speakerButton.src = "images/speaker-with-three-sound-waves.256x243.png";
            audioPlayer.volume = lastMusicVolume;
            speakerButtonValue = false;
        }
    });

    // Timeline functionality
    function songTimeLine(value) {
        if (window.timelineInterval) {
            clearInterval(window.timelineInterval);
        }
        
        if (songPlay && !audioPlayer.ended) {
            window.timelineInterval = setInterval(() => {
                if (audioPlayer.ended) {
                    clearInterval(window.timelineInterval);
                    buttonValue = false;
                    finalButtonPlaySong.innerHTML = `<img src="images/playButton.png" alt="#">`;
                    return;
                }
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                timelineBar.style.width = progress + '%';
            }, value);
        }
    }
}

// Global event listeners for volume control
window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const volumeBar = document.getElementById('volumeBar');
        const volumeBarContainer = document.getElementById('volumeBarContainer');
        const rect = volumeBarContainer.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        offsetX = Math.max(0, Math.min(offsetX, rect.width));
        const volume = offsetX / rect.width;
        volumeBar.style.width = volume * 100 + '%';
        audioPlayer.volume = volume;
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

// Add audio element to HTML if not present
if (!document.getElementById("audioPlayer")) {
    const audio = document.createElement("audio");
    audio.id = "audioPlayer";
    document.body.appendChild(audio);
}