const mainTitle = document.querySelector("h1");
if (mainTitle) {
    mainTitle.classList.add("slide-item", "slide-left");
}

const sectionHeadings = document.querySelectorAll("section h2");

sectionHeadings.forEach((heading, index) => {
    const directionClass = index % 2 === 0 ? "slide-left" : "slide-right";
    heading.classList.add("slide-item", directionClass);

    const section = heading.closest("section");
    if (section) {
        const sectionUnderlines = section.querySelectorAll(".underline");
        sectionUnderlines.forEach((underline) => {
            underline.classList.add("slide-item", directionClass);
        });

        const sectionParagraphs = section.querySelectorAll("p");
        sectionParagraphs.forEach((paragraph) => {
            paragraph.classList.add("slide-item", directionClass);
        });
    }
});

const videoWrappers = Array.from(document.querySelectorAll(".video-embed-wrap"));
const videosEndText = document.querySelector(".video-list > p:last-of-type, .video-list p:last-of-type");
const videoSlideItems = [...videoWrappers];

if (videosEndText) {
    videoSlideItems.push(videosEndText);
}

videoSlideItems.forEach((item, index) => {
    const directionClass = index % 2 === 0 ? "slide-left" : "slide-right";
    item.classList.add("slide-item");
    item.classList.remove("slide-left", "slide-right");
    item.classList.add(directionClass);
});

const slideItems = document.querySelectorAll(".slide-item");

const headingObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
            } else {
                entry.target.classList.remove("in-view");
            }
        });
    },
    {
        threshold: 0.25,
    }
);

slideItems.forEach((item) => {
    headingObserver.observe(item);
});

const nav = document.querySelector("header nav");

if (nav) {
    const navSpacer = document.createElement("div");
    navSpacer.style.display = "none";
    nav.after(navSpacer);

    let navTopOffset = nav.offsetTop;

    const updateNavStickiness = () => {
        const shouldFixNav = window.scrollY >= navTopOffset;

        if (shouldFixNav) {
            nav.classList.add("is-fixed");
            navSpacer.style.display = "block";
            navSpacer.style.height = `${nav.offsetHeight}px`;
        } else {
            nav.classList.remove("is-fixed");
            navSpacer.style.display = "none";
            navSpacer.style.height = "0px";
        }
    };

    const refreshNavOffset = () => {
        const wasFixed = nav.classList.contains("is-fixed");
        if (wasFixed) {
            nav.classList.remove("is-fixed");
            navSpacer.style.display = "none";
            navSpacer.style.height = "0px";
        }

        navTopOffset = nav.offsetTop;
        updateNavStickiness();
    };

    window.addEventListener("scroll", updateNavStickiness);
    window.addEventListener("resize", refreshNavOffset);
    window.addEventListener("orientationchange", refreshNavOffset);
    window.addEventListener("load", refreshNavOffset);

    refreshNavOffset();
}

const syncLatestUploadOverlay = async () => {
    const YT_API_KEY = "AIzaSyBsBNTy35Qe2hhWfwiLtbPdOA1M7JmRQaw";
    const CHANNEL_ID = "UCMPguzj3FhfshH50x4LaJEA";
    const firstWrapper = document.querySelector(".video-embed-wrap");
    const latestIframe = firstWrapper?.querySelector(".featured-video");
    const latestLink = firstWrapper?.querySelector(".video-overlay-list a");

    if (!latestIframe || !latestLink) {
        return;
    }

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=1`);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const item = data.items[0];
            const videoId = item.id.videoId;
            const videoTitle = item.snippet.title;
            if (videoId) {
                latestIframe.src = `https://www.youtube.com/embed/${videoId}`;
                latestIframe.title = `${videoTitle} | The Unsupervised Guys`;
                latestLink.textContent = videoTitle;
                latestLink.href = `https://www.youtube.com/watch?v=${videoId}`;
            }
        }
    } catch (error) {
        console.error("Failed to fetch latest YouTube video:", error);
    }
};

syncLatestUploadOverlay();
