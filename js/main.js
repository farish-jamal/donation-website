(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 3000); // 3 second delay
    };
    spinner(0);
    
    
    // Initiate the wowjs
    new WOW().init();


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow');
            } else {
                $('.fixed-top').removeClass('bg-white shadow');
            }
        } else {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow').css('top', -45);
            } else {
                $('.fixed-top').removeClass('bg-white shadow').css('top', 0);
            }
        }
    });
    
    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: false,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:3
            }
        }
    });


    // Fetch and display events from backend
    function loadEvents() {
        const eventsContainer = $('#events-container');
        const apiUrl = 'https://donation-website-s9mi.onrender.com/api/event/get-all-events';

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                return response.json();
            })
            .then(data => {
                if (data.success && data.events && data.events.length > 0) {
                    displayEvents(data.events);
                } else {
                    showNoEvents();
                }
            })
            .catch(error => {
                console.error('Error loading events:', error);
                showError();
            });
    }

    function displayEvents(events) {
        const eventsContainer = $('#events-container');
        eventsContainer.empty();

        events.forEach((event, index) => {
            const delay = (index * 0.2).toFixed(1);
            const eventDate = new Date(event.dateAndTime);
            
            // Format date: "26 Aug 2026"
            const formattedDate = eventDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

            // Format time: "Fri 06:55"
            const formattedTime = eventDate.toLocaleDateString('en-US', {
                weekday: 'short'
            }) + ' ' + eventDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            const eventHTML = `
                <div class="row g-4 event-item wow fadeIn" data-wow-delay="${delay}s">
                    <div class="col-3 col-lg-2 pe-0">
                        <div class="text-center border-bottom border-dark py-3 px-2">
                            <h6>${formattedDate}</h6>
                            <p class="mb-0">${formattedTime}</p>
                        </div>
                    </div>
                    <div class="col-9 col-lg-6 border-start border-dark pb-5">
                        <div class="ms-3">
                            <h4 class="mb-3">${event.title}</h4>
                            <p class="mb-4">${event.description}</p>
                            ${event.location ? `<p class="mb-3"><i class="fas fa-map-marker-alt text-primary me-2"></i>${event.location}</p>` : ''}
                            <a href="#" class="btn btn-primary px-3">Join Now</a>
                        </div>
                    </div>
                    <div class="col-12 col-lg-4">
                        <div class="overflow-hidden mb-5">
                            <img src="${event.image}" class="img-fluid w-100" alt="${event.title}">
                        </div>
                    </div>
                </div>
            `;

            eventsContainer.append(eventHTML);
        });

        // Reinitialize WOW.js for newly added elements
        new WOW().init();
    }

    function showNoEvents() {
        const eventsContainer = $('#events-container');
        eventsContainer.html(`
            <div class="text-center py-5">
                <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <h4>No Upcoming Events</h4>
                <p class="text-muted">Check back soon for new events!</p>
            </div>
        `);
    }

    function showError() {
        const eventsContainer = $('#events-container');
        eventsContainer.html(`
            <div class="text-center py-5">
                <i class="fas fa-exclamation-circle fa-3x text-danger mb-3"></i>
                <h4>Failed to Load Events</h4>
                <p class="text-muted">Please try again later.</p>
            </div>
        `);
    }

    // Load events when document is ready
    if ($('#events-container').length > 0) {
        loadEvents();
    }

    // Fetch and display blogs from backend
    function loadBlogs() {
        const blogsContainer = $('#blogs-container');
        const apiUrl = 'https://donation-website-s9mi.onrender.com/api/blog/get-all-blogs';

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }
                return response.json();
            })
            .then(data => {
                if (data.success && data.blogs && data.blogs.length > 0) {
                    displayBlogs(data.blogs);
                } else {
                    showNoBlogs();
                }
            })
            .catch(error => {
                console.error('Error loading blogs:', error);
                showBlogsError();
            });
    }

    // Helper function to strip HTML tags
    function stripHtml(html) {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    // Helper function to get first 100 words
    function getFirst100Words(content) {
        const text = stripHtml(content);
        const words = text.trim().split(/\s+/);
        if (words.length <= 100) {
            return text;
        }
        return words.slice(0, 100).join(' ') + '...';
    }

    function displayBlogs(blogs) {
        const blogsContainer = $('#blogs-container');
        blogsContainer.empty();

        blogs.forEach((blog, index) => {
            const delay = (index * 0.2).toFixed(1);
            const blogDate = new Date(blog.createdAt);
            
            // Format date
            const formattedDate = blogDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

            // Get first 100 words from content
            const shortContent = getFirst100Words(blog.content);

            const blogHTML = `
                <div class="col-lg-6 col-xl-4">
                    <div class="sermon-item wow fadeIn" data-wow-delay="${delay}s">
                        <div class="overflow-hidden p-4 pb-0">
                            <img src="${blog.image}" class="img-fluid w-100" alt="${blog.title}" style="height: 250px; object-fit: cover;">
                        </div>
                        <div class="p-4">
                            <div class="sermon-meta d-flex justify-content-between pb-2">
                                <div class="">
                                    <small><i class="fa fa-calendar me-2 text-muted"></i><span class="text-muted me-2">${formattedDate}</span></small>
                                    <small><i class="fas fa-user me-2 text-muted"></i><span class="text-muted">${blog.postBy}</span></small>
                                </div>
                                <div class="">
                                    ${blog.tags.map(tag => `<span class="badge bg-primary me-1">${tag}</span>`).join('')}
                                </div>
                            </div>
                            <a href="blog-detail.html?id=${blog._id}" class="d-inline-block h4 lh-sm mb-3">${blog.title}</a>
                            <div class="mb-3">
                                <p class="mb-0">${shortContent}</p>
                            </div>
                            <a href="blog-detail.html?id=${blog._id}" class="btn btn-primary px-3">Read More</a>
                        </div>
                    </div>
                </div>
            `;

            blogsContainer.append(blogHTML);
        });

        // Reinitialize WOW.js for newly added elements
        new WOW().init();
    }

    function showNoBlogs() {
        const blogsContainer = $('#blogs-container');
        blogsContainer.html(`
            <div class="col-12 text-center py-5">
                <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
                <h4>No Blogs Available</h4>
                <p class="text-muted">Check back soon for new content!</p>
            </div>
        `);
    }

    function showBlogsError() {
        const blogsContainer = $('#blogs-container');
        blogsContainer.html(`
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-circle fa-3x text-danger mb-3"></i>
                <h4>Failed to Load Blogs</h4>
                <p class="text-muted">Please try again later.</p>
            </div>
        `);
    }

    // Load blogs when document is ready
    if ($('#blogs-container').length > 0) {
        loadBlogs();
    }

})(jQuery);

// Handle Join Us form submission
function submitJoinForm(event) {
    const name = document.getElementById('joinName').value.trim();
    const email = document.getElementById('joinEmail').value.trim();
    const phone = document.getElementById('joinPhone').value.trim();
    const message = document.getElementById('joinMessage').value.trim();

    // Basic validation
    if (!name || !email || !phone) {
        alert('Please fill in all required fields.');
        return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Phone validation (basic)
    const phonePattern = /^[0-9+\-\s()]{10,}$/;
    if (!phonePattern.test(phone)) {
        alert('Please enter a valid phone number.');
        return;
    }

    // Prepare data for API
    const formData = {
        name: name,
        email: email,
        phoneNumber: phone,
        message: message
    };

    // Get API URL from config
    const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.MEMBER);

    // Show loading state (find the submit button)
    const submitBtn = event ? event.target : document.querySelector('#joinUsModal .btn-primary[onclick*="submitJoinForm"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i>Submitting...';
    }

    // Send data to server
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to submit form');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Show success message
            alert('Thank you for joining us, ' + name + '! We will contact you soon.');

            // Reset form and close modal
            document.getElementById('joinUsForm').reset();
            var modal = bootstrap.Modal.getInstance(document.getElementById('joinUsModal'));
            if (modal) {
                modal.hide();
            }
        } else {
            throw new Error(data.message || 'Failed to submit form');
        }
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        alert('Sorry, there was an error submitting your form. Please try again later.');
    })
    .finally(() => {
        // Restore button state
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// Allow form submission on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const joinUsForm = document.getElementById('joinUsForm');
    if (joinUsForm) {
        joinUsForm.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitJoinForm();
            }
        });
    }
});
