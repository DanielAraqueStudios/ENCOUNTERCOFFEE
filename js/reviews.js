// Reviews Management Script - Node.js backend version

// Global test function for debugging
window.testReviewsAPI = function() {
    console.log('Testing Reviews System (Node.js Backend)...');
    fetch('http://localhost:3000/api/health')
        .then(response => response.json())
        .then(data => {
            console.log('API Status:', data);
            alert('API Status:\n' + JSON.stringify(data, null, 2));
        })
        .catch(error => {
            console.error('API check failed:', error);
            alert('API check failed:\n' + error.message + '\n\nMake sure Node.js server is running:\nnpm install\nnpm start');
        });
};

document.addEventListener('DOMContentLoaded', async function() {
    const reviewForm = document.getElementById('reviewForm');
    const reviewsList = document.getElementById('reviewsList');
    const paginationContainer = document.getElementById('reviewsPagination');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');
    const starRating = document.getElementById('starRating');
    const ratingValue = document.getElementById('ratingValue');
    
    let currentPage = 1;
    let totalPages = 1;
    let currentRating = 0;
    
    // ========== API CONFIGURATION ==========
    const API_BASE_URL = 'http://localhost:3000/api';
    
    // ========== BACKEND API FUNCTIONS (Node.js) ==========
    async function submitReviewToBackend(formData) {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to submit review');
        }
        return data.review;
    }
    
    async function loadReviewsFromBackend(page = 1) {
        const response = await fetch(`${API_BASE_URL}/reviews?page=${page}&perPage=3`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to load reviews');
        }
        
        return {
            reviews: data.reviews,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalReviews: data.totalReviews
        };
    }
    
    // Make test function available
    window.testReviewsSubmit = function() {
        console.log('Testing review submission...');
        const testData = {
            name: 'Test User',
            review: 'This is a test review from Node.js backend',
            rating: 5
        };
        
        fetch(`${API_BASE_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Test result:', data);
            alert('Test review submitted!\n' + JSON.stringify(data, null, 2));
            loadReviews();
        })
        .catch(error => {
            console.error('Test failed:', error);
            alert('Test failed:\n' + error.message + '\n\nMake sure Node.js server is running:\nnpm install\nnpm start');
        });
    };
    
    // Star rating interaction
    const stars = starRating.querySelectorAll('i');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            currentRating = this.dataset.value;
            ratingValue.value = currentRating;
            
            // Update star display
            stars.forEach(s => {
                if (s.dataset.value <= currentRating) {
                    s.classList.add('active');
                    s.classList.remove('bi-star');
                    s.classList.add('bi-star-fill');
                } else {
                    s.classList.remove('active');
                    s.classList.remove('bi-star-fill');
                    s.classList.add('bi-star');
                }
            });
        });
        
        star.addEventListener('mouseover', function() {
            const hoverValue = this.dataset.value;
            stars.forEach(s => {
                if (s.dataset.value <= hoverValue) {
                    s.style.color = 'var(--encounter-golden)';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });
    
    starRating.addEventListener('mouseout', function() {
        stars.forEach(s => {
            if (s.dataset.value <= currentRating) {
                s.style.color = 'var(--encounter-golden)';
            } else {
                s.style.color = '#ddd';
            }
        });
    });
    
    // Form submission handler
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('reviewName').value.trim();
            const review = document.getElementById('reviewText').value.trim();
            
            // Validate
            if (!name || !review || currentRating === 0) {
                showMessage('Please fill all fields and select a rating', 'error');
                return;
            }
            
            // Submit review to backend
            const formData = {
                name: name,
                review: review,
                rating: currentRating
            };
            
            try {
                const newReview = await submitReviewToBackend(formData);
                showMessage('Thank you! Your review has been submitted.', 'success');
                reviewForm.reset();
                currentRating = 0;
                ratingValue.value = 0;
                
                // Reset stars
                stars.forEach(s => {
                    s.classList.remove('active');
                    s.classList.remove('bi-star-fill');
                    s.classList.add('bi-star');
                    s.style.color = '#ddd';
                });
                
                // Reload reviews
                currentPage = 1;
                await loadReviews();
            } catch (error) {
                console.error('Error:', error);
                showMessage('Error submitting review: ' + error.message, 'error');
            }
        });
    }
    
    // Load reviews from backend
    async function loadReviews(page = 1) {
        try {
            const data = await loadReviewsFromBackend(page);
            
            if (data.reviews.length === 0 && data.totalReviews === 0) {
                reviewsList.innerHTML = '<div class="no-reviews-message">No reviews yet. Be the first to share your experience!</div>';
            } else {
                displayReviews(data.reviews);
            }
            
            currentPage = data.currentPage;
            totalPages = data.totalPages;
            updatePagination();
        } catch (error) {
            console.error('Error loading reviews:', error);
            reviewsList.innerHTML = '<div class="no-reviews-message">Error loading reviews. Make sure Node.js server is running on port 3000.</div>';
        }
    }
    
    // Display reviews
    function displayReviews(reviews) {
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<div class="no-reviews-message">No reviews yet. Be the first to share your experience!</div>';
            return;
        }
        
        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-avatar">
                        ${review.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="review-info">
                        <div class="review-name">${review.name}</div>
                        <div class="review-rating">
                            ${getStarRating(review.rating)}
                        </div>
                        <div class="review-date">${formatDate(review.date)}</div>
                    </div>
                </div>
                <div class="review-text">${review.review}</div>
            </div>
        `).join('');
    }
    
    // Get star rating HTML
    function getStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="bi bi-star-fill"></i>';
            } else {
                stars += '<i class="bi bi-star"></i>';
            }
        }
        return stars;
    }
    
    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Update pagination
    function updatePagination() {
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'flex';
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }
    
    // Pagination buttons
    prevPageBtn.addEventListener('click', async function() {
        if (currentPage > 1) {
            currentPage--;
            await loadReviews(currentPage);
            window.scrollTo({ top: reviewsList.offsetTop - 100, behavior: 'smooth' });
        }
    });
    
    nextPageBtn.addEventListener('click', async function() {
        if (currentPage < totalPages) {
            currentPage++;
            await loadReviews(currentPage);
            window.scrollTo({ top: reviewsList.offsetTop - 100, behavior: 'smooth' });
        }
    });
    
    // Show message
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `review-form-${type}`;
        messageDiv.textContent = message;
        
        const formContainer = document.querySelector('.review-form-container');
        formContainer.insertBefore(messageDiv, formContainer.firstChild);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
    
    // Load reviews on page load
    await loadReviews();
});
