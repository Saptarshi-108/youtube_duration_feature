// Function to parse duration string (e.g., "1:23", "10:45", "1:05:30") into seconds
function parseDurationToSeconds(durationString) {
    const parts = durationString.split(':').map(Number);
    let seconds = 0;
    if (parts.length === 3) { // HH:MM:SS
        seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) { // MM:SS
        seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 1) { // SS (unlikely for YouTube but for robustness)
        seconds = parts[0];
    }
    return seconds;
}

// Function to format seconds into 3h 41min 24sec format
function formatSecondsToHMSFancy(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    let parts = [];
    if (hours > 0) {
        parts.push(`${hours}h`);
    }
    if (minutes > 0 || (hours > 0 && seconds > 0)) {
        parts.push(`${minutes}min`);
    } else if (hours === 0 && seconds > 0 && minutes === 0) {
        parts.push(`0min`);
    }
    if (seconds > 0 || (hours === 0 && minutes === 0 && seconds === 0)) {
        parts.push(`${seconds}sec`);
    }

    if (parts.length === 0) {
        return "0sec";
    }

    return parts.join(' ');
}


// Function to calculate and display total duration
function calculateAndDisplayTotalDuration() {
    console.log('Calculating playlist duration...');
    let totalSeconds = 0;
    let videoCount = 0;

    const durationCandidates = document.querySelectorAll('div.badge-shape-wiz__text');

    if (durationCandidates.length === 0) {
        console.warn('No duration candidates found with class "badge-shape-wiz__text".');
        const existingDisplay = document.getElementById('yt-playlist-duration-display');
        if (existingDisplay) {
            existingDisplay.remove();
        }
        return;
    }

    durationCandidates.forEach(badgeDiv => {
        const durationText = badgeDiv.textContent.trim();

        // Regex to ensure the text matches a time format (e.g., 1:23, 10:45, 1:05:30)
        if (!durationText.match(/(\d{1,2}:){0,2}\d{1,2}/)) {
            return; // Skip if not a duration string
        }

        const videoElementContainer = badgeDiv.closest('ytd-playlist-video-renderer');
        
        if (!videoElementContainer) {
            return; // Skip if this badge is not part of a video element
        }

        // Check for live badges within the video element
        const isLive = videoElementContainer.querySelector(
            '#thumbnail-container #live-badge, ' +
            '#thumbnail #badge-label.ytd-badge-supported-renderer[aria-label="LIVE"], ' +
            'ytd-thumbnail-overlay-time-status-renderer[overlay-style="LIVE"], ' +
            'ytd-thumbnail-overlay-time-status-renderer[aria-label*="LIVE"]'
        );

        if (isLive) {
            return; // Skip live videos
        }

        const seconds = parseDurationToSeconds(durationText);
        if (!isNaN(seconds)) {
            totalSeconds += seconds;
            videoCount++;
        } else {
            console.warn(`Could not parse valid duration for non-live element: "${durationText}"`);
        }
    });

    const formattedDuration = formatSecondsToHMSFancy(totalSeconds);

    // --- Robust Targeting for the Injection Point ---
    const maxRetries = 10; // Max attempts to find the target div
    let currentRetry = 0;
    let targetContainerDiv = null;

    const findAndInsertDuration = () => {
        // Find all divs with this class and select the last one, which is typically an empty placeholder
        const allHeadlineInfoDivs = document.querySelectorAll('.page-header-view-model-wiz__page-header-headline-info');
        if (allHeadlineInfoDivs.length > 0) {
            targetContainerDiv = allHeadlineInfoDivs[allHeadlineInfoDivs.length - 1];
        }

        if (targetContainerDiv) {
            // Element found, proceed with insertion
            let existingDisplayDiv = document.getElementById('yt-playlist-duration-display');

            if (!existingDisplayDiv) {
                // Create a new div if it doesn't exist
                existingDisplayDiv = document.createElement('div');
                existingDisplayDiv.id = 'yt-playlist-duration-display';
                existingDisplayDiv.className = 'yt-playlist-total-duration-display'; 
                
                // Clear any existing content in the target div before appending
                targetContainerDiv.innerHTML = ''; 
                targetContainerDiv.appendChild(existingDisplayDiv);
            }

            existingDisplayDiv.textContent = `Total Duration: ${formattedDuration} (${videoCount} videos)`;
            existingDisplayDiv.classList.remove('loading'); // Remove loading state if any
            console.log(`Displayed: Total Duration: ${formattedDuration} (${videoCount} videos) in target info section.`);

        } else if (currentRetry < maxRetries) {
            currentRetry++;
            console.log(`Retrying to find target info div (attempt ${currentRetry}/${maxRetries})...`);
            setTimeout(findAndInsertDuration, 250); // Retry after a short delay (250ms)
        } else {
            // If max retries reached and still not found
            console.warn('Could not find the designated info section div for duration injection after multiple retries. The selector might be outdated or the element never rendered.');
            const existingDisplay = document.getElementById('yt-playlist-duration-display');
            if (existingDisplay) {
                existingDisplay.remove(); // Clean up if failed
            }
        }
    };

    findAndInsertDuration(); // Initiate the search and insertion process
}


// --- MutationObserver for Dynamic Content Loading ---
let playlistContentObserver = null; // Renamed for clarity to avoid conflict with URL observer

const observePlaylistChanges = () => {
    // Target the main container where playlist videos are loaded
    const playlistContainer = document.querySelector('ytd-playlist-panel-renderer #contents, ytd-playlist-video-list-renderer #contents');

    // Only create and start observer if playlistContainer is found and observer isn't already active
    if (playlistContainer && !playlistContentObserver) {
        playlistContentObserver = new MutationObserver((mutations) => {
            let changesDetected = false;
            for (let mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if new video elements or duration badges were added
                    const newVideosAdded = Array.from(mutation.addedNodes).some(node =>
                        node.nodeType === 1 && ( // Ensure it's an element node
                            node.matches('ytd-playlist-video-renderer') ||
                            node.querySelector('ytd-playlist-video-renderer') || // If a parent of video renderer was added
                            node.matches('div.badge-shape-wiz__text') ||
                            node.querySelector('div.badge-shape-wiz__text') // If a parent of badge was added
                        )
                    );
                    if (newVideosAdded) {
                        changesDetected = true;
                        break; // Found relevant changes, no need to check further mutations
                    }
                }
            }
            if (changesDetected) {
                console.log('New playlist items or badges detected, re-calculating duration.');
                const displayElement = document.getElementById('yt-playlist-duration-display');
                if (displayElement) {
                    displayElement.classList.add('loading'); // Add a loading class for potential styling
                }
                // Debounce the calculation to avoid excessive re-runs during rapid changes
                clearTimeout(window.playlistDurationTimeout);
                window.playlistDurationTimeout = setTimeout(calculateAndDisplayTotalDuration, 750); // Small delay to allow rendering
            }
        });

        // Start observing for changes within the playlist container
        playlistContentObserver.observe(playlistContainer, { childList: true, subtree: true });
        console.log('MutationObserver started for playlist content container.');
    } else if (!playlistContainer) {
        console.warn('Playlist content container not found for observation.');
    }
};


// --- Initial Load and URL Change Handling ---

// Initial calculation when the script loads on a playlist page
window.addEventListener('load', () => {
    // Add a slight delay to ensure the page has loaded critical elements
    setTimeout(() => {
        calculateAndDisplayTotalDuration();
        observePlaylistChanges();
    }, 2000); // 2-second initial delay
});

// Observer to detect URL changes without a full page reload (typical for YouTube's SPA behavior)
let lastUrl = location.href;
new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        if (lastUrl.includes('/playlist')) {
            console.log('URL changed to a playlist, re-initializing extension.');
            // Disconnect existing content observer if active
            if (playlistContentObserver) {
                playlistContentObserver.disconnect();
                playlistContentObserver = null; // Reset it
            }
            // Clear any pending calculation timeouts
            clearTimeout(window.playlistDurationTimeout);
            // Re-run calculations and observation after a delay for new page load
            setTimeout(() => {
                calculateAndDisplayTotalDuration();
                observePlaylistChanges();
            }, 2000); // 2-second delay after URL change
        } else {
            // If navigated away from a playlist page
            if (playlistContentObserver) {
                playlistContentObserver.disconnect();
                playlistContentObserver = null;
            }
            // Remove the displayed duration if present
            const displayDiv = document.getElementById('yt-playlist-duration-display');
            if (displayDiv) {
                displayDiv.remove();
            }
            console.log('Navigated away from playlist page, observer disconnected and display removed.');
        }
    }
}).observe(document, {subtree: true, childList: true}); // Observe the entire document for URL changes