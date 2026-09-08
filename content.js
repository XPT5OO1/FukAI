console.log("FukAI is running!");

const processedCards = new WeakSet();

function getPublishedDate(card) {
  const dateElement = card.querySelector(
    "yt-content-metadata-view-model span[aria-label]"
  );

  if (!dateElement) {
    return null;
  }

  const text = dateElement.getAttribute("aria-label");

  if (!text) {
    return null;
  }

  const now = new Date();

  // "X years ago"
  let match = text.match(/^(\d+)\s+years?\s+ago$/i);

  if (match) {
    const yearsAgo = parseInt(match[1], 10);

    const date = new Date(now);
    date.setFullYear(date.getFullYear() - yearsAgo);

    return date;
  }

  // "X months ago"
  match = text.match(/^(\d+)\s+months?\s+ago$/i);

  if (match) {
    const monthsAgo = parseInt(match[1], 10);

    const date = new Date(now);
    date.setMonth(date.getMonth() - monthsAgo);

    return date;
  }

  // "X weeks ago"
  match = text.match(/^(\d+)\s+weeks?\s+ago$/i);

  if (match) {
    const weeksAgo = parseInt(match[1], 10);

    const date = new Date(now);
    date.setDate(date.getDate() - (weeksAgo * 7));

    return date;
  }

  // "X days ago"
  match = text.match(/^(\d+)\s+days?\s+ago$/i);

  if (match) {
    const daysAgo = parseInt(match[1], 10);

    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    return date;
  }

  // "X hours ago"
  match = text.match(/^(\d+)\s+hours?\s+ago$/i);

  if (match) {
    const hoursAgo = parseInt(match[1], 10);

    const date = new Date(now);
    date.setHours(date.getHours() - hoursAgo);

    return date;
  }

  // "X minutes ago"
  match = text.match(/^(\d+)\s+minutes?\s+ago$/i);

  if (match) {
    const minutesAgo = parseInt(match[1], 10);

    const date = new Date(now);
    date.setMinutes(date.getMinutes() - minutesAgo);

    return date;
  }

  return null;
}


const observer = new MutationObserver(() => {
  const cards = document.querySelectorAll("ytd-rich-item-renderer");

  cards.forEach(card => {

    // Already successfully processed
    if (processedCards.has(card)) {
      return;
    }

    const links = [...card.querySelectorAll("a")];

    const videoLink = links.find(link =>
      link.href.includes("/watch?v=")
    );

    const channelLink = links.find(link =>
      link.href.includes("/@") ||
      link.href.includes("/channel/")
    );

    if (!videoLink || !channelLink) {
      return;
    }

    const videoURL = new URL(videoLink.href);
    const videoID = videoURL.searchParams.get("v");

    const channelURL = channelLink.href;
    const channelName = channelLink.textContent.trim();

    const publishedDate = getPublishedDate(card);

    // Date hasn't appeared yet.
    // Don't mark the card as processed.
    if (!publishedDate) {
      return;
    }

    console.log("──────────────");

    console.log("Video ID:", videoID);
    console.log("Video URL:", videoLink.href);
    console.log("Channel:", channelName);
    console.log("Channel URL:", channelURL);

    console.log(
      "Published:",
      publishedDate.toLocaleDateString()
    );

    console.log(
      "Year:",
      publishedDate.getFullYear()
    );

    const potentialSlop = publishedDate.getFullYear() >= 2020;

    console.log("Potential slop:", potentialSlop);

    processedCards.add(card);
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});