

/* ── Constants & State ─────────────────────────────────────── */


let newsData = [];
let galleryData = [];
let members = [];



let currentImages = [];
let currentIndex = 0;

let currentZoom = 1;
let initialDistance = 0;

let homeGalleryImages = [];
let currentGalleryIndex = 0;




/* =========================================================
   🚀 OPEN MEMBERS SECTION FROM HOME
   - Switch to Team tab
   - Scroll to members table
========================================================= */
function openMembers() {

  // Open Team page
  show('team', document.querySelectorAll('.nav-links button')[3]);

  // Wait for DOM to render
  setTimeout(() => {
    const section = document.getElementById("membersSection");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, 100);
}


/* ── Navigation ────────────────────────────────────────────── */
function show(id, btn) {

    document.querySelectorAll('.page')
        .forEach(p => p.classList.remove('active'));

    document.querySelectorAll('.nav-links button')
        .forEach(b => b.classList.remove('active'));

    document.getElementById(id)
        .classList.add('active');

    if (btn) btn.classList.add('active');

    history.pushState(
        { page: id },
        '',
        '#' + id
    );

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    if (id === 'news') loadNews();
    if (id === 'gallery') loadGallery();

    document.getElementById("navLinks").classList.remove("open");
}

/* Browser Back / Forward */
window.addEventListener('popstate', function(event) {

    const page = event.state?.page || 'home';

    document.querySelectorAll('.page')
        .forEach(p => p.classList.remove('active'));

    document.querySelectorAll('.nav-links button')
        .forEach(b => b.classList.remove('active'));

    document.getElementById(page)
        ?.classList.add('active');

    const navMap = {
        home: 0,
        gallery: 1,
        news: 2,
        team: 3,
        contact: 4
    };

    const buttons =
        document.querySelectorAll('.nav-links button');

    if (buttons[navMap[page]]) {
        buttons[navMap[page]]
            .classList.add('active');
    }
});

window.addEventListener('load', function () {

    const page =
        window.location.hash
            ? window.location.hash.substring(1)
            : 'home';

    document.querySelectorAll('.page')
        .forEach(p => p.classList.remove('active'));

    document.getElementById(page)?.classList.add('active');

    document.querySelectorAll('.nav-links button')
        .forEach(b => b.classList.remove('active'));

    const navMap = {
        home: 0,
        gallery: 1,
        news: 2,
        team: 3,
        contact: 4
    };

    const buttons =
        document.querySelectorAll('.nav-links button');

    if (buttons[navMap[page]]) {
        buttons[navMap[page]].classList.add('active');
    }

    history.replaceState(
        { page: page },
        '',
        '#' + page
    );

    if (page === 'gallery') loadGallery();
    if (page === 'news') loadNews();
});



function toggleMenu() { document.getElementById('navLinks').classList.toggle('open'); }

/* ── Helpers ───────────────────────────────────────────────── */

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return {
    day: d.getDate().toString().padStart(2,'0'),
    mon: d.toLocaleString('en-GB', { month:'short' }),
    year: d.getFullYear()
  };
}



/* ── Public News Render ────────────────────────────────────── */
function renderNews(data) {

    const list =
        document.getElementById("newsList");

    if (!data.length) {

        list.innerHTML =
            "<p>No news available.</p>";

        return;
    }

    list.innerHTML = data.map(a => {

        const d = fmtDate(a.date);

        const pdfButton =
            a.pdf
            ? `<a class="btn-download"
                   href="${a.pdf}"
                   target="_blank">
                   View PDF
               </a>`
            : `<span class="no-pdf-badge">
                   No PDF
               </span>`;

        return `

        <div class="news-item" id="news-${a.id}">

           <div class="news-date">

    <strong>${d.day}</strong>

    <span class="news-month">${d.mon}</span>

    <span class="news-year">${d.year}</span>

</div>

            <div class="news-body">

                <span class="news-tag">

                    ${a.category}

                </span>

                <h3>${a.title}</h3>

                <p>${a.description}</p>

            </div>

            <div class="news-actions">

                ${pdfButton}

            </div>

        </div>

        `;

    }).join("");
}

/* ── Init ──────────────────────────────────────────────────── */
loadNews();
loadMembers();
loadGallery();setTimeout(() => {

    startHomeGallerySlider();

},1000);
loadBirthdays();
loadHomeNews();

loadHomeVideos();
loadLeaderMessage();




async function loadGallery() {

    

    const response =
        await fetch(
            "data/gallery.json"
        );

    const events =
        await response.json();

        galleryData = events;

        homeGalleryImages = [];

events.forEach(event => {

    event.images.forEach(image => {

        homeGalleryImages.push(image);

    });

});

homeGalleryImages =
    homeGalleryImages.slice(0,5);

    if(homeGalleryImages.length > 0){

    const homeImage =
        document.getElementById(
            "homeGalleryImage"
        );

    if(homeImage){

        homeImage.src =
            homeGalleryImages[0];
    }
}

    const grid =
        document.getElementById(
            "galleryGrid"
        );

    grid.innerHTML = "";

   events.forEach((event,index) => {
        const coverImage =
    event.images.length > 0
    ? event.images[0]
    : "";

       grid.innerHTML += `
<div class="gallery-item"
     onclick="openGallery(${index})">

   <div class="photo-badge">
    📷 ${event.images.length}
</div>

    <img
        src="${coverImage}"
        class="gallery-cover">

<div class="gallery-card-info">

    <h3>${event.title}</h3>

    <p class="gallery-description">
        ${event.description}
    </p>

   
</div>

</div>
`;
    });
}



function openGallery(index){

    const event =
        galleryData[index];

    document.getElementById(
        "galleryModalTitle"
    ).innerText =
        event.title;

    const container =
        document.getElementById(
            "galleryModalImages"
        );

    container.innerHTML = "";

    currentImages = event.images;

    event.images.forEach((image,idx) => {

     container.innerHTML += `
    <img
        src="${image}"
        class="gallery-modal-image"
        onclick="openImageViewer(${idx}, '${image}')">
`;
    });

    document.getElementById(
        "galleryModal"
    ).style.display =
        "block";
}

function closeGalleryModal(){

    document.getElementById(
        "galleryModal"
    ).style.display =
        "none";
}

function openImageViewer(index,imagePath)

{

    currentIndex = index;
    currentZoom = 1;

    document.getElementById("viewerImage").style.transform ="translate(-50%,-50%) scale(1)";
    document.getElementById("viewerImage").src = imagePath;

    updateImageCounter();

    const viewer =document.getElementById("imageViewer");
    viewer.style.display = "flex";
}



// ESC key support
document.addEventListener(
    "keydown",
    function(e){

        if(e.key === "Escape"){

            closeImageViewer();
        }
    }
);


// Swipe Feature
const imageViewer =
    document.getElementById("imageViewer");

imageViewer.addEventListener(
    "touchstart",
    function(e){

        touchStartX =
            e.changedTouches[0].screenX;
    }
);

imageViewer.addEventListener(
    "touchend",
    function(e){

        touchEndX =
            e.changedTouches[0].screenX;

       if(currentZoom === 1){

    handleSwipe();
}
    }
);

function handleSwipe(){

    const swipeDistance =
        touchEndX - touchStartX;

    if(swipeDistance > 50){

        showPreviousImage();
    }

    if(swipeDistance < -50){

        showNextImage();
    }
}

function showPreviousImage(){

    currentIndex--;

    if(currentIndex < 0){

        currentIndex =
            currentImages.length - 1;
    }

    document.getElementById(
        "viewerImage"
    ).src =
        currentImages[currentIndex];

    currentZoom = 1;

    document.getElementById(
        "viewerImage"
    ).style.transform =
        "translate(-50%,-50%) scale(1)";

    updateImageCounter();
}



function showNextImage(){

    currentIndex++;

    if(
        currentIndex >=
        currentImages.length
    ){

        currentIndex = 0;
    }

    document.getElementById("viewerImage").src =
        currentImages[currentIndex];

    currentZoom = 1;

    document.getElementById(
        "viewerImage"
    ).style.transform =
        "translate(-50%,-50%) scale(1)";

    updateImageCounter();
}
function closeImageViewer(){

    document.getElementById(
        "imageViewer"
    ).style.display = "none";
}

const viewerImage =
    document.getElementById(
        "viewerImage"
    );

viewerImage.addEventListener(
    "wheel",
    function(e){

        e.preventDefault();

        if(e.deltaY < 0){

            currentZoom += 0.1;

        }else{

            currentZoom -= 0.1;
        }

        if(currentZoom < 1){

            currentZoom = 1;
        }

        if(currentZoom > 5){

            currentZoom = 5;
        }

        viewerImage.style.transform =

            `translate(-50%,-50%) scale(${currentZoom})`;
    }
);

viewerImage.addEventListener(
    "touchstart",
    function(e){

        if(e.touches.length === 2){

            initialDistance =
                getDistance(
                    e.touches
                );
        }
    }
);

viewerImage.addEventListener(
    "touchmove",
    function(e){

        if(e.touches.length === 2){

            e.preventDefault();

            const currentDistance =
                getDistance(
                    e.touches
                );

            if(currentDistance >
               initialDistance){

                currentZoom += 0.03;

            }else{

                currentZoom -= 0.03;
            }

            if(currentZoom < 1){

                currentZoom = 1;
            }

            if(currentZoom > 5){

                currentZoom = 5;
            }

            viewerImage.style.transform =

                `translate(-50%,-50%) scale(${currentZoom})`;

            initialDistance =
                currentDistance;
        }
    }
);


function updateImageCounter(){

    document.getElementById(
        "imageCounter"
    ).innerHTML =

        "📷 " +

        (currentIndex + 1) +

        " / " +

        currentImages.length;
}

function getDistance(touches){

    const x =
        touches[0].clientX -
        touches[1].clientX;

    const y =
        touches[0].clientY -
        touches[1].clientY;

    return Math.sqrt(
        x*x + y*y
    );


    
}


let countersStarted = false;

function startCounters(){

    if(countersStarted) return;

    countersStarted = true;

    const counters =
        document.querySelectorAll(".counter");

    counters.forEach(counter => {

        const target =
            parseInt(counter.dataset.target);

        let current = 0;

        const increment =
            Math.max(
                1,
                Math.ceil(target / 50)
            );

        const timer =
            setInterval(() => {

                current += increment;

                if(current >= target){

                    current = target;

                    clearInterval(timer);
                }

                counter.textContent =
                    current + "+";

            }, 25);

    });
}

window.addEventListener("load", () => {

    startCounters();

});

function renderMembers(memberList){

    const tbody =
        document.getElementById(
            "membersTable"
        );

    tbody.innerHTML = "";

    memberList.forEach((member,index) => {

        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${member.memberName}</td>
                <td>${member.designation}</td>
                <td>${member.office}</td>
                 <td>${member.location}</td>
                <td>
                    <a href="tel:${member.contactNumber}">
                        ${member.contactNumber}
                    </a>
                </td>
            </tr>
        `;
    });
}

function populateOfficeDropdown(){

    const dropdown =
        document.getElementById(
            "departmentFilter"
        );

    dropdown.innerHTML =
        '<option value="">All Offices</option>';

    const offices =
        [...new Set(
            members.map(
                m => m.office
            )
        )];

    offices.sort();

    offices.forEach(office => {

        dropdown.innerHTML += `
            <option value="${office}">
                ${office}
            </option>
        `;
    });
}

function populateDesignationDropdown(){

    const dropdown =
        document.getElementById(
            "designationFilter"
        );

    dropdown.innerHTML =
        '<option value="">All Designations</option>';

    const designations =
        [...new Set(
            members.map(
                m => m.designation
            )
        )];

    designations.sort();

    designations.forEach(designation => {

        dropdown.innerHTML += `
            <option value="${designation}">
                ${designation}
            </option>
        `;
    });
}

function filterMembers(){

    const search =
        document.getElementById(
            "memberSearch"
        ).value.toLowerCase();

    const office =
        document.getElementById(
            "departmentFilter"
        ).value;

    const designation =
        document.getElementById(
            "designationFilter"
        ).value;

    const filtered =
        members.filter(member => {

            const searchMatch =

                member.memberName
                    .toLowerCase()
                    .includes(search)

                ||

                member.office
                    .toLowerCase()
                    .includes(search)

                ||

                member.designation
                    .toLowerCase()
                    .includes(search)

                ||

                member.location
                     .toLowerCase()
                     .includes(search);

            const officeMatch =

                !office ||

                member.office === office;

            const designationMatch =

                !designation ||

                member.designation === designation;

            return searchMatch
                &&
                officeMatch
                &&
                designationMatch;
        });

    renderMembers(filtered);
}


async function loadMembers() {

    try {

        const response = await fetch(
            "data/members.json"
        );

        members = await response.json();

      renderMembers(members);

      populateOfficeDropdown();

    populateDesignationDropdown();

    } catch (error) {

        console.error(
            "Error loading members:",
            error
        );
    }
}






async function loadNews(){

    const response =
        await fetch("data/news.json");

    newsData =
        await response.json();

    newsData.sort(
        (a,b)=>
        new Date(b.date)
        - new Date(a.date)
    );

    renderNews(newsData);
}

let currentCategory = "All";

function filterNews(category){

    currentCategory = category;

    applyNewsFilters();
}

function searchNews(){

    applyNewsFilters();
}

function applyNewsFilters(){

    const searchBox =
        document.getElementById("newsSearch");

    const keyword =
        searchBox
        ? searchBox.value.toLowerCase()
        : "";

    let filtered = newsData;

    if(currentCategory !== "All"){

        filtered =
            filtered.filter(item =>
                item.category === currentCategory
            );
    }

    if(keyword){

        filtered =
            filtered.filter(item =>

                item.title
                    .toLowerCase()
                    .includes(keyword)

                ||

                item.description
                    .toLowerCase()
                    .includes(keyword)

                ||

                item.category
                    .toLowerCase()
                    .includes(keyword)
            );
    }

    renderNews(filtered);
}


function openBirthdayModal(){

    document.body.style.overflow = "hidden";

    const container =
        document.getElementById(
            "birthdayList"
        );

    if(
        birthdayMembers.length === 0
    ){

        container.innerHTML =
            `
            <p>
                No birthdays this month.
            </p>
            `;

    }else{

        container.innerHTML = "";

        birthdayMembers.forEach(
            member => {

            const day =
                member.birthday
                .split("-")[1];

            container.innerHTML +=
            `
            <div class="birthday-card">

                <div class="birthday-date">
                    ${day}
                </div>

                <div>

                    <h3>
                        ${member.memberName}
                    </h3>

                    <p>
                        ${member.designation}
                    </p>

                </div>

            </div>
            `;
        });
    }

    document.getElementById(
        "birthdayModal"
    ).style.display = "flex";

    document.activeElement?.blur();
}

function closeBirthdayModal(){

    document.body.style.overflow = "auto";

    document.getElementById(
        "birthdayModal"
    ).style.display = "none";
}


let birthdayMembers = [];

async function loadBirthdays(){

    const response =
        await fetch("data/members.json");

    const members =
        await response.json();

    const currentMonth =
        String(
            new Date().getMonth() + 1
        ).padStart(2,"0");

    // Filter birthdays of current month
    birthdayMembers =
        members.filter(member =>
            member.birthday &&
            member.birthday.startsWith(currentMonth)
        );

    // Sort by day
    birthdayMembers.sort((a, b) => {

        const dayA = parseInt(a.birthday.split("-")[1], 10);
        const dayB = parseInt(b.birthday.split("-")[1], 10);

        return dayA - dayB;
    });

    document.getElementById("birthdayCount").textContent =
        birthdayMembers.length;
}




const heroSlides =
    document.querySelectorAll(".hero-slide");

let currentHeroSlide = 0;

setInterval(() => {

    heroSlides[currentHeroSlide].classList.remove("active");

    currentHeroSlide =
        (currentHeroSlide + 1) % heroSlides.length;

    heroSlides[currentHeroSlide].classList.add("active");

}, 4000);


let departments = [];


async function openDepartments(){

    document.body.style.overflow = "hidden";

    const container =
        document.getElementById(
            "departmentList"
        );

    try {

        const response =
            await fetch("data/departments.json");

        departments =
            await response.json();

        if(departments.length === 0){

            container.innerHTML =
                `
                <p>
                    No departments available.
                </p>
                `;

        }else{

            renderDepartments(
                departments
            );
        }

        document.getElementById(
            "departmentModal"
        ).style.display = "flex";

        document.activeElement?.blur();

    }catch(error){

        console.error(
            "Error loading departments:",
            error
        );

        container.innerHTML =
            `
            <p>
                Unable to load departments.
            </p>
            `;

        document.body.style.overflow = "";
    }
}


function closeDepartments(){

    document.body.style.overflow = "auto";

    document.getElementById(
        "departmentModal"
    ).style.display = "none";
}


function renderDepartments(list){

    const container =
        document.getElementById(
            "departmentList"
        );

    container.innerHTML = "";

    list.forEach(
        (dept,index) => {

        container.innerHTML +=
        `
        <div class="birthday-card">

            <div class="birthday-date">
                ${index + 1}
            </div>

            <div>

                <h4>
                    ${dept.departmentName}
                </h4>

            </div>

        </div>
        `;
    });
}


function filterDepartments(){

    const keyword =
        document.getElementById(
            "departmentSearch"
        ).value.toLowerCase();

    const filtered =
        departments.filter(
            dept =>
                dept.departmentName
                    .toLowerCase()
                    .includes(keyword)
        );

    renderDepartments(
        filtered
    );
}

window.addEventListener('click', function(e) {

    const birthdayModal =
        document.getElementById('birthdayModal');

    const departmentModal =
        document.getElementById('departmentModal');

    if (e.target === birthdayModal) {
        closeBirthdayModal();
    }

    if (e.target === departmentModal) {
        closeDepartments();
    }

});


async function loadHomeNews(){

    const response =
        await fetch(
            "data/news.json"
        );

    const news =
        await response.json();

    const container =
        document.getElementById(
            "homeNewsContainer"
        );

    container.innerHTML = "";

    const tickerNews =
        [...news, ...news];

tickerNews.forEach((item,index)=>{

    container.innerHTML += `

    <div class="ticker-news-item"
         onclick="openNewsFromHome(${item.id})">

        📰 ${item.title}

    </div>

    `;
});

}

function openNewsFromHome(index){

    show(
        'news',
        document.querySelectorAll('.nav-links button')[2]
    );

    setTimeout(() => {

        const newsCards =
            document.querySelectorAll(
                '.news-card'
            );

        if(newsCards[index]){

            newsCards[index]
            .scrollIntoView({

                behavior:'smooth',

                block:'center'
            });

            newsCards[index]
            .classList.add(
                'highlight-news'
            );

            setTimeout(() => {

                newsCards[index]
                .classList.remove(
                    'highlight-news'
                );

            },3000);
        }

    },500);
}


function startHomeGallerySlider(){

    setInterval(() => {

        if(
            homeGalleryImages.length === 0
        ){
            return;
        }

        currentGalleryIndex++;

        if(
            currentGalleryIndex >=
            homeGalleryImages.length
        ){

            currentGalleryIndex = 0;
        }

        document.getElementById(
            "homeGalleryImage"
        ).src =
        homeGalleryImages[
            currentGalleryIndex
        ];

    },3000);

}

function openNewsFromHome(id){

    show(
        "news",
        document.querySelectorAll(".nav-links button")[2]
    );

    document.getElementById("newsSearch").value = "";

    filterNews("All");

    setTimeout(() => {

        const news = document.getElementById(`news-${id}`);

        if(news){

            news.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            news.classList.add("highlight-news");

            setTimeout(() => {
                news.classList.remove("highlight-news");
            }, 3000);
        }

    }, 300);
}


let homeVideos = [];
let currentVideoIndex = 0;

async function loadHomeVideos() {

    const response = await fetch("data/video.json");

    homeVideos = await response.json();

    homeVideos.sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    showVideo(0);

    if (homeVideos.length > 1) {

        setInterval(() => {

            currentVideoIndex++;

            if (currentVideoIndex >= homeVideos.length) {
                currentVideoIndex = 0;
            }

            showVideo(currentVideoIndex);

        }, 4000);

    }

}



function showVideo(index) {

    const video = homeVideos[index];

    document.getElementById("homeVideoContainer").innerHTML = `

        <div class="video-card">

            <a
                href="https://www.youtube.com/watch?v=${video.youtubeId}"
                target="_blank">

                <img
                    class="video-thumbnail"
                    src="https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg"
                    alt="${video.title}">

            </a>

            <div class="video-title">

                ${video.title}

            </div>

            <div class="video-date">

                📅 ${formatVideoDate(video.date)}

            </div>

            <a
                href="https://www.youtube.com/@ITUnionBanswara"
                target="_blank"
                class="visit-channel">

                ▶ Visit Our Channel

            </a>

        </div>

    `;

}

function formatVideoDate(date) {

    return new Date(date).toLocaleDateString("en-GB", {

        day: "2-digit",
        month: "short",
        year: "numeric"

    });

}

async function loadLeaderMessage() {

    const response = await fetch("data/leader.json");

    const leader = await response.json();

    document.getElementById("leaderContainer").innerHTML = `

        <div class="leader-card">

            <div class="leader-header">

                <img
                    src="${leader.photo}"
                    alt="${leader.name}"
                    class="leader-photo">

                <div class="leader-info">

                    <div class="leader-name">
                        ${leader.name}
                    </div>

                    <div class="leader-designation">
                        ${leader.designation}
                    </div>

                </div>

            </div>

            <div class="leader-message">

                ${leader.message}

            </div>

        </div>

    `;

}
