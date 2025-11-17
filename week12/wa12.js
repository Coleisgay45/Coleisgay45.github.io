const apiKey = "AIzaSyDTAIgvceU_fypu3VJZPkgRe77gF4kADUI";
const videoId = "nkEH4npdvY4"; // Replace with a valid public video ID

// Recommended videos endpoint
const relatedEndpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=5&key=${apiKey}`;

// Fallback: most popular videos
const popularEndpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=5&regionCode=US&key=${apiKey}`;

function displayVideos(endpoint) {
  fetch(endpoint)
    .then(response => response.json())
    .then(data => {
      console.log("API response:", data);

      if (!data.items || data.items.length === 0) {
        throw new Error("No items in response.");
      }

      const container = document.getElementById("recommended");
      container.innerHTML = data.items.map(item => {
        // For search results, videoId is nested under item.id.videoId
        const vid = item.id?.videoId || item.id; 
        return `
          <div>
            <h3>${item.snippet.title}</h3>
            <iframe width="320" height="180"
              src="https://www.youtube.com/embed/${vid}"
              frameborder="0" allowfullscreen></iframe>
          </div>
        `;
      }).join("");
    })
    .catch(error => {
      console.error("Error fetching videos:", error);
      // Fallback to most popular if related fails
      if (endpoint === relatedEndpoint) {
        console.log("Falling back to most popular videos...");
        displayVideos(popularEndpoint);
      }
    });
}

// Start with related videos
displayVideos(relatedEndpoint);

function filterDisplayedVideos(threshold = 0.05) {
  // Grab all iframes currently displayed in #recommended
  const iframes = document.querySelectorAll("#recommended iframe");
  const ids = Array.from(iframes).map(iframe => {
    const src = iframe.src;
    // Extract video ID from the embed URL
    return src.split("/embed/")[1];
  });

  if (ids.length === 0) {
    console.error("No videos to filter.");
    return;
  }

  // Call videos.list to get statistics
  const statsEndpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids.join(",")}&key=${apiKey}`;

  fetch(statsEndpoint)
    .then(res => res.json())
    .then(data => {
      if (!data.items) throw new Error("No stats found.");

      // Filter by likes/views ratio
      const filtered = data.items.filter(item => {
        const views = parseInt(item.statistics.viewCount, 10);
        const likes = parseInt(item.statistics.likeCount, 10);
        if (!views || !likes) return false;
        return likes / views > threshold;
      });

      // Display filtered videos
      const filteredContainer = document.getElementById("filtered");
      filteredContainer.innerHTML = filtered.map(item => `
        <div>
          <h3>${item.snippet.title}</h3>
          <p>Likes: ${item.statistics.likeCount}, Views: ${item.statistics.viewCount}</p>
          <p>Ratio: ${(item.statistics.likeCount / item.statistics.viewCount).toFixed(2)}</p>
          <iframe width="320" height="180"
            src="https://www.youtube.com/embed/${item.id}"
            frameborder="0" allowfullscreen></iframe>
        </div>
      `).join("");
    })
    .catch(err => console.error("Error filtering videos:", err));
}

filterButton.addEventListener("click", () => {
  filterDisplayedVideos(0.05); // 5% threshold
});
