function removeActiveClass(){
    const activeButtons = document.getElementsByClassName("active");
    for(let btn of activeButtons){
        btn.classList.remove('active');
    }
    
}


// ✅ Load categories on page load
function loadCategories() {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.categories));
}

// ✅ Load all videos by default
function loadVideos() {
    fetch("https://openapi.programming-hero.com/api/phero-tube/videos")
        .then(res => res.json())
        .then(data => {
            removeActiveClass();
            document.getElementById('all-btn').classList.add('active');
            if (!data || !data.videos) {
                console.error("❌ Error: No videos data found.");
                return;
            }
            displayVideos(data.videos); // ✅ Show all videos initially
        });
}

// ✅ Load videos by category
const loadCategoriesVideo = (id) => {
    const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActiveClass();
            const clickedButton = document.getElementById(`btn-${id}`);
            clickedButton.classList.add('active');
            displayVideos(data.category);
        });
}

// ✅ Display Categories as Buttons
function displayCategories(categories) {
    const categoryContainer = document.getElementById('category-container');
    categoryContainer.innerHTML = ""; // Clear previous buttons

    // Add "All" button
    const allButton = document.createElement('button');
    allButton.className = "btn btn-sm";
    allButton.id = "all-btn"
    allButton.innerText = "All";
    allButton.onclick = loadVideos; // Show all videos
    categoryContainer.appendChild(allButton);

    // Add category buttons dynamically
    categories.forEach(cat => {
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `
            <button id="btn-${cat.category_id}" onclick="loadCategoriesVideo(${cat.category_id})" class="btn btn-sm hover:text-white hover:bg-[#FF1F3D]">
                ${cat.category}
            </button>
        `;
        categoryContainer.appendChild(categoryDiv);
    });
}

// ✅ Display Videos in the UI
const displayVideos = (videos) => {
    // console.log("✅ Displaying Videos:", videos);

    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML = "";
    
    if(videos.length == 0){
        videoContainer.innerHTML = `
            <div class="col-span-full text-center items-center flex flex-col justify-center">
                <img src="assets/Icon.png" alt="" srcset="">
                <h2 class="text-2xl font-bold">Oops!! Sorry, There is no content here</h2>
            </div>
        `; 
        return;
    }

    videos.forEach(video => {
        // console.log("🎥 Video:", video);

        const videoCard = document.createElement('div');
        videoCard.classList.add("card", "bg-base-100", "p-3", "rounded-md");

        videoCard.innerHTML = `
            <div class="relative">
                <img class="w-full h-[150px] object-cover rounded-md" src="${video.thumbnail}" alt="${video.title}" />
                <span class="absolute bottom-2 right-2 bg-black text-white rounded-sm px-2 text-sm">3hrs 56 min ago</span>
            </div>

            <div class="flex gap-2 py-3">
                <div class="avatar w-10 h-10 rounded-full overflow-hidden">
                    <img src="${video.authors?.[0]?.profile_picture || 'default-avatar.png'}" alt="${video.authors?.[0]?.profile_name || 'Unknown'}">
                </div>
                <div>
                    <h2 class="text-sm font-semibold">${video.title}</h2>
                    <p class="text-xs text-gray-400">${video.authors?.[0]?.profile_name || 'Unknown Author'}</p>
                    <p class="text-xs text-gray-400">${video.others?.views || "No views"}</p>
                </div>
            </div>
        `;

        videoContainer.appendChild(videoCard);
    });
}

// ✅ Run on page load
loadCategories();
loadVideos(); // Show all videos initially
