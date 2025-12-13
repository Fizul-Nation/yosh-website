
        // DOM elements
        const pastEventsContainer = document.getElementById('past-events-container');
        const upcomingEventsContainer = document.getElementById('upcoming-events-container');
        const eventModal = document.getElementById('event-modal');
        const modalClose = document.getElementById('modal-close');
        const navLinks = document.querySelectorAll('.nav-links a');
        const footerLinks = document.querySelectorAll('.footer-column a');



        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            loadEventsFromCSV();
            setupEventListeners();
        });

        // Function to load events from CSV file
        async function loadEventsFromCSV() {
  try {
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTYatI0oqMmYsX_nDLqevWdLiK4vcpgiLeLLe8TTjv6s4MMyboFG3bPRSYmWLU8cx0Xlr3bKVgY6Com/pub?output=csv";
    const res = await fetch(url);
    const text = await res.text();

// test update - just checking Git commits

    console.log("Fetched CSV text:", text);

    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

    const rows = parsed.data.map(r => ({
      title: (r.title || '').trim(),
      date: (r.date || '').trim(),
      time: (r.time || '').trim(),
      location: (r.location || '').trim(),
      category: (r.category || '').trim(),
      description: (r.description || '').trim(),
      image: normalizeImageUrl((r.image || '').trim()),
      highlight: String(r.highlight).toLowerCase() === 'true'
    }));

    const today = new Date();
    window.pastEvents = rows.filter(e => new Date(e.date) < today);
    window.upcomingEvents = rows.filter(e => new Date(e.date) >= today);

    displayPastEvents();
    displayUpcomingEvents();
  } catch (err) {
    console.error('Error loading CSV:', err);
    loadSampleEvents();
  }
}

function normalizeImageUrl(url) {
  if (!url) return '';

  // Imgur page -> direct link
  const imgurPage = /^https?:\/\/(www\.)?imgur\.com\/(?!gallery|a\/)([^.\/?#]+)$/i;
  const m = url.match(imgurPage);
  if (m) return `https://i.imgur.com/${m[2]}.jpg`;

  // i.imgur.com without extension
  if (/^https?:\/\/i\.imgur\.com\/[^.\/?#]+$/i.test(url)) return url + '.jpg';

  // Google Drive
  const drive = /https?:\/\/drive\.google\.com\/file\/d\/([^\/]+)\//i.exec(url);
  if (drive) return `https://drive.google.com/thumbnail?sz=w1000&id=${drive[1]}`;

  return url;
}

                
                

        // Function to load sample events (fallback)
        function loadSampleEvents() {
            // Sample events data
            const sampleEvents = [
                {
                    title: "Tech Innovation Summit",
                    date: "2023-03-15",
                    time: "9:00 AM - 5:00 PM",
                    location: "Main Auditorium",
                    category: "career",
                    description: "Our biggest tech event of the year featuring industry leaders from top tech companies. Students got to network with professionals and learn about the latest innovations in AI, blockchain, and more.",
                    image: "https://picsum.photos/seed/techsummit/600/400.jpg",
                    highlight: true
                },
                {
                    title: "Spring Music Festival",
                    date: "2023-04-22",
                    time: "4:00 PM - 11:00 PM",
                    location: "Campus Green",
                    category: "social",
                    description: "An outdoor music festival featuring student bands and local artists. Over 500 students attended, enjoying live music, food trucks, and a beautiful spring evening.",
                    image: "https://picsum.photos/seed/musicfest/600/400.jpg",
                    highlight: true
                },
                {
                    title: "Career Fair 2023",
                    date: "2023-02-10",
                    time: "10:00 AM - 3:00 PM",
                    location: "Student Center",
                    category: "career",
                    description: "Over 50 companies participated in our annual career fair, offering internships and full-time positions to students. Many attendees secured interviews and job offers on the spot!",
                    image: "https://picsum.photos/seed/careerfair/600/400.jpg",
                    highlight: false
                },
                {
                    title: "Coding Bootcamp",
                    date: "2023-01-20",
                    time: "9:00 AM - 6:00 PM",
                    location: "Computer Lab",
                    category: "workshop",
                    description: "A full-day intensive coding workshop where students learned web development fundamentals from industry professionals. All participants built their first web application by the end of the day!",
                    image: "https://picsum.photos/seed/coding/600/400.jpg",
                    highlight: false
                },
                {
                    title: "Outdoor Adventure Trip",
                    date: "2022-11-05",
                    time: "7:00 AM - 7:00 PM",
                    location: "Mountain State Park",
                    category: "sports",
                    description: "A day of hiking, team-building activities, and nature exploration. Students challenged themselves with a difficult trail and enjoyed a picnic with panoramic views at the summit.",
                    image: "https://picsum.photos/seed/hiking/600/400.jpg",
                    highlight: false
                },
                {
                    title: "Halloween Costume Party",
                    date: "2022-10-31",
                    time: "8:00 PM - 1:00 AM",
                    location: "Student Union Ballroom",
                    category: "social",
                    description: "Our spookiest event of the year! Students showcased their creativity with amazing costumes, enjoyed themed drinks and snacks, and danced the night away at our annual Halloween party.",
                    image: "https://picsum.photos/seed/halloween/600/400.jpg",
                    highlight: false
                }
            ];
            
            // Separate past and upcoming events
            const currentDate = new Date();
            const pastEvents = sampleEvents.filter(event => new Date(event.date) < currentDate);
            const upcomingEvents = sampleEvents.filter(event => new Date(event.date) >= currentDate);
            
            // Update global arrays
            window.pastEvents = pastEvents;
            window.upcomingEvents = upcomingEvents;
            
            // Display events
            displayPastEvents();
            displayUpcomingEvents();
        }

        // Setup event listeners
        function setupEventListeners() {
            modalClose.addEventListener('click', () => {
                eventModal.style.display = 'none';
            });

            window.addEventListener('click', (e) => {
                if (e.target === eventModal) {
                    eventModal.style.display = 'none';
                }
            });

            // Add smooth scrolling to navigation and footer links
            const allLinks = [...navLinks, ...footerLinks];
            allLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

        // Display past events
        function displayPastEvents() {
            pastEventsContainer.innerHTML = '';

            if (window.pastEvents.length === 0) {
                pastEventsContainer.innerHTML = '<p>No past events to display.</p>';
                return;
            }

            window.pastEvents.forEach(event => {
                const eventCard = createEventCard(event, true);
                pastEventsContainer.appendChild(eventCard);
            });
        }

        // Display upcoming events
        function displayUpcomingEvents() {
            upcomingEventsContainer.innerHTML = '';

            if (window.upcomingEvents.length === 0) {
                upcomingEventsContainer.innerHTML = '<p>No upcoming events to display.</p>';
                return;
            }

            window.upcomingEvents.forEach(event => {
                const eventCard = createEventCard(event, false);
                upcomingEventsContainer.appendChild(eventCard);
            });
        }

        // Create event card element
        function createEventCard(event, isPast) {
            const card = document.createElement('div');
            card.className = 'event-card';

            // Format date
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Use lazy loading + async decode + fallback for robustness/performance
const imageElement = event.image 
  ? `<img src="${event.image}" alt="${event.title}"
         loading="lazy" decoding="async" fetchpriority="low"
         onerror="this.onerror=null; this.src='https://picsum.photos/seed/default-fallback/600/400.jpg';">`
  : `<div style="display:flex;justify-content:center;align-items:center;height:100%;width:100%;background-color: var(--accent);color: var(--primary);font-size:2rem;">
       <i class="fas fa-calendar-alt"></i>
     </div>`;


            // Create highlight badge for past events
            const highlightBadge = isPast && event.highlight 
                ? `<div class="event-badge">Highlight</div>`
                : '';

            card.innerHTML = `
                <div class="event-image">
                    ${imageElement}
                    ${highlightBadge}
                </div>
                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-date">
                        <i class="fas fa-calendar"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="event-date">
                        <i class="fas fa-clock"></i>
                        <span>${event.time}</span>
                    </div>
                    <div class="event-date">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    <p class="event-description">${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</p>
                    <a href="#" class="event-link" data-event-id="${event.title}">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
            `;

            // Add click event to "Learn More" link
            const learnMoreLink = card.querySelector('.event-link');
            learnMoreLink.addEventListener('click', (e) => {
                e.preventDefault();
                showEventModal(event);
            });

            return card;
        }

        // Show event modal with details
        function showEventModal(event) {
            // Format date
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Set modal content
            document.getElementById('modal-title').textContent = event.title;
            document.getElementById('modal-date').textContent = formattedDate;
            document.getElementById('modal-time').textContent = event.time;
            document.getElementById('modal-location').textContent = event.location;
            document.getElementById('modal-category').textContent = event.category.charAt(0).toUpperCase() + event.category.slice(1);
            document.getElementById('modal-description').textContent = event.description;
            
            // Set modal image
            const modalImage = document.getElementById('modal-image');
            if (event.image) {
                modalImage.src = event.image;
                modalImage.alt = event.title;
                modalImage.style.display = 'block';
            } else {
                modalImage.style.display = 'none';
            }

            // Set register link
            const registerLink = document.getElementById('modal-register');
            registerLink.href = `mailto:info@univenture.edu?subject=Registration for ${event.title}&body=I would like to register for the ${event.title} event on ${formattedDate}.`;

            // Show modal
            eventModal.style.display = 'flex';
        }

        // Delete event function
        function deleteEvent(eventTitle) {
            // Find and remove the event from arrays
            window.pastEvents = window.pastEvents.filter(event => event.title !== eventTitle);
            window.upcomingEvents = window.upcomingEvents.filter(event => event.title !== eventTitle);
            
            // Update the display
            displayPastEvents();
            displayUpcomingEvents();
            
            // Optionally, you could also update the CSV file here
            console.log(`Event "${eventTitle}" has been deleted`);
        }
    
        const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

// Close when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});
