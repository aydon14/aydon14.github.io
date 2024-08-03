document.addEventListener('DOMContentLoaded', function() {
    /* This function fetches articles present in ./posts/posts.json.
    posts.json is a config containing filenames, dates, and titles. */
    if (window.location.href.includes('index.html') || !window.location.href.includes('.html')) {
        fetch('posts/posts.json')
            .then(response => response.json())
            .then(posts => {
                const postsContainer = document.getElementById('posts-container');
                if (posts.length == 0) {
                    const noPostsMessage = document.createElement('div');
                    noPostsMessage.classList.add('no-posts-message');
                    noPostsMessage.textContent = 'No posts available yet.';
                    postsContainer.appendChild(noPostsMessage);
                } else {
                    posts.forEach(post => {
                        const article = document.createElement('article');
                        article.classList.add('post');
                        article.innerHTML = `
                            <h2>${post.title}</h2>
                            <p class="meta">${post.date}</p>
                            <button class="continue-reading" onclick="togglePost('${post.filename}', '${post.title}', '${post.date}')">Read More</button>
                        `;
                        postsContainer.appendChild(article);
                    });
                }
            })
            .catch(error => console.error('Error loading posts:', error));
    }
});

function togglePage() {
    /* This function toggles the about me page, acting as a link. */
    const currentURL = window.location.href;
    if (currentURL.includes('index.html') || !currentURL.includes('.html')) {
        window.location.href = 'about.html';
    } else if (currentURL.includes('posts/')) {
        window.location.href = '../index.html';
    } else {
        window.location.href = 'index.html';
    }
}

function togglePost(filename, title, date) {
    /* This function toggles the post page using the filename given. */
    fetch("posts/" + filename)
        .then(response => {
            if (response.ok) {
                localStorage.setItem('postFilename', filename);
                localStorage.setItem('postTitle', title);
                localStorage.setItem('postDate', date);
                window.location.href = "post.html";
            } else if (response.status === 404) {
                showNotification("Sorry, the post you are looking for does not exist.");
            } else {
                showNotification("An error occurred while trying to load the post.");
            }
        })
        .catch(error => {
            console.error('Error checking post:', error);
            showNotification("An error occurred while trying to load the post.");
        });
}

function openSource() {
    /* This function toggles the source page to open in a new tab. */
    window.open('https://github.com/aydon14/aydon14.github.io', '_blank');
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hidden');
    }, 5000); // Hide after 5 seconds
}