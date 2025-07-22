# YouTube Playlist Total Duration (UI Integrated)

This simple browser extension helps you quickly see the **total duration** of any YouTube playlist, seamlessly integrated directly into the playlist's header on YouTube. No more manual calculations or guessing!

## Features

* **Total Playlist Duration:** Displays the combined length of all videos in a playlist.
* **Video Count:** Shows the total number of videos in the playlist.
* **Live Video Exclusion:** Automatically excludes live streams from the total duration calculation.
* **Dynamic Updates:** Automatically recalculates and updates the duration if videos are added, removed, or the page updates (e.g., infinite scrolling).
* **UI Integrated:** The duration is displayed right within the playlist's main information section for a clean, native feel.
* **Lightweight & Efficient:** Designed to be fast and not hog your browser's resources.

---

## Installation Guide

You can easily install this extension in any Chromium-based browser (like **Chrome**, **Brave**, **Edge**, etc.) by loading it unpacked.

### 1. Download the Files

First, you need to get the extension files onto your computer:

* **Option A: Download ZIP (Easiest)**
    1.  Go to the main page of this GitHub repository.
    2.  Click the green **`< > Code`** button.
    3.  Select **`Download ZIP`**.
    4.  Extract the downloaded `Youtubelist-duration-main.zip` file to a location you'll remember (e.g., your Desktop or Documents folder). You'll get a folder named `Youtubelist-duration-main`.

* **Option B: Clone with Git (For Developers)**
    ```bash
    git clone [https://github.com/Saptarshi-108/youtube-playlist-duration.git](https://github.com/Saptarshi-108/youtube-playlist-duration.git)
    ```

### 2. Load the Extension in Your Browser

Once you have the files, follow these steps for your browser:

1.  **Open Extensions Page:**
    * Open your browser (Chrome, Brave, Edge, etc.).
    * Type `chrome://extensions` (for Chrome/Brave) or `edge://extensions` (for Edge) into the address bar and press Enter.

2.  **Enable Developer Mode:**
    * In the top-right corner of the Extensions page, you'll see a toggle switch for **"Developer mode"**. Make sure this is **turned on**.

3.  **Load Unpacked:**
    * With Developer mode enabled, a new button will appear in the top-left called **"Load unpacked"**. Click it.

4.  **Select Extension Folder:**
    * A file browser window will pop up. Navigate to and select the **`Youtubelist-duration-main`** (or whatever you named it if you cloned it) folder that you extracted/cloned in Step 1.
    * Click **"Select Folder"** (or "Open").

5.  **You're Done!**
    * The "YouTube Playlist Total Duration" extension should now appear on your extensions page and be active.
    * **Open a new tab** and go to any YouTube playlist URL. You should immediately see the total duration displayed.

---

## Packing Your Extension (Optional)

If you want to create a single `.crx` file (a packaged extension file) that you can easily share or back up, follow these steps:

1.  **Go to Extensions Page:** (Same as Step 2 in "Load the Extension")
    * `chrome://extensions` (or `brave://extensions`, `edge://extensions`).

2.  **Ensure Developer Mode is ON.**

3.  **Click "Pack extension":**
    * You'll see a button named **"Pack extension"** (usually near the "Load unpacked" button). Click it.

4.  **Browse for Root Directory:**
    * In the pop-up, click the **"Browse..."** button next to "Extension root directory".
    * Select the **`Youtubelist-duration-main`** folder (the one containing `manifest.json`, `content.js`, etc.).

5.  **Click "Pack extension" again.**
    * Your browser will generate two files in the parent directory of your extension folder:
        * `.crx` (the packaged extension file)
        * `.pem` (a private key file - **keep this safe!** You'll need it if you ever want to update your packaged extension).

Now you have a single `.crx` file that can be dragged and dropped onto the `chrome://extensions` page of another Chromium browser to install it directly (though Developer mode might still be required depending on browser security settings).

---

## Deleting Local Files While Keeping the Extension

Once you've successfully loaded the extension in your browser (using "Load unpacked" or after packing it), your browser makes a copy of the extension files internally.

This means you **can delete the local `Youtubelist-duration-main` folder** from your computer after the extension is loaded, and the extension will continue to work in your browser.

**However, keep these points in mind:**

* **No More Local Changes:** If you delete the local files, you won't be able to make any further changes or updates to the extension (like fixing bugs or adding new features) without downloading the files again.
* **Reloading Issues:** If you delete the local files and then later disable and re-enable the extension (or restart your browser in some cases), the browser might report an error or ask you to locate the missing files.
* **Packing Requires Local Files:** You cannot pack the extension into a `.crx` file without the original local folder.

**Recommendation:** It's generally a good idea to keep the local folder, especially if you plan to ever update the extension or pack it. If storage space is critical, you can delete it, but be aware of the limitations.

---

Feel free to open an issue or submit a pull request if you have suggestions or find any bugs! (which I'm sure you'll find anyways).
