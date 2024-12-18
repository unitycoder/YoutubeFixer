// ==UserScript==
// @name         Replace YouTube Menu Item with My Channel
// @namespace    http://unitycoder.com
// @version      1.2
// @description  Replace the second YouTube menu item with a link to "My Channel"
// @author       You
// @match        https://www.youtube.com/
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Wait for an element to appear in the DOM
    function waitForElement(selector, callback, interval = 100, timeout = 10000) {
        const startTime = Date.now();
        const timer = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(timer);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(timer);
                console.warn(`Element with selector "${selector}" not found within ${timeout}ms`);
            }
        }, interval);
    }

    // Extract the channel hashcode from the YouTube Studio link
    function getChannelHashcode() {
        const studioLink = document.querySelector('a[href*="studio.youtube.com/channel/"]');
        if (studioLink) {
            const match = studioLink.href.match(/channel\/([a-zA-Z0-9_-]+)/);
            return match ? match[1] : null;
        }
        return null;
    }

    // Replace the second menu item in the left panel
    function replaceMenuItem(channelHashcode) {
        if (!channelHashcode) return;

        waitForElement('ytd-guide-entry-renderer:nth-child(2)', (secondItem) => {
            if (secondItem) {
                const myChannelLink = `https://www.youtube.com/channel/${channelHashcode}`;

                // Replace the link and prevent event overrides
                const anchor = secondItem.querySelector('a');
                if (anchor) {
                    anchor.href = myChannelLink;

                    // Prevent original click events
                    anchor.addEventListener('click', (event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        window.location.href = myChannelLink;
                    }, true); // Use capture phase to override other listeners
                }

                // Update the text to "My Channel"
                const title = secondItem.querySelector('.title');
                if (title) {
                    title.textContent = 'My Channel';
                }

                // Optional: Update the icon
                const icon = secondItem.querySelector('yt-icon');
                if (icon) {
                    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M12 20.5c1.894 0 3.643-.62 5.055-1.666a5.5 5.5 0 00-10.064-.105.755.755 0 01-.054.099A8.462 8.462 0 0012 20.5Zm4.079-5.189a7 7 0 012.142 2.48 8.5 8.5 0 10-12.443 0 7 7 0 0110.3-2.48ZM12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm2-12.5a2 2 0 11-4 0 2 2 0 014 0Zm1.5 0a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0Z"/></svg>`;
                }
            }
        });
    }

    // Run the script after the page loads
    window.addEventListener('load', () => {
        waitForElement('a[href*="studio.youtube.com/channel/"]', () => {
            const channelHashcode = getChannelHashcode();
            if (channelHashcode) {
                replaceMenuItem(channelHashcode);
            }
        });
    });
})();
