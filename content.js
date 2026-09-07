console.log("FukAI is running!");

const processedCards = new WeakSet();

const observer = new MutationObserver(() => {
  const cards = document.querySelectorAll("ytd-rich-item-renderer");

  cards.forEach(card => {
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

    console.log("──────────────");
    console.log("Video ID:", videoID);
    console.log("Video URL:", videoLink.href);
    console.log("Channel:", channelName);
    console.log("Channel URL:", channelURL);

    processedCards.add(card);
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});