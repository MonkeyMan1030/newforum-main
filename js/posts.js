class Posts {
    constructor() {
        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.postsList = document.getElementById('posts-list');
        this.postModal = document.getElementById('post-modal');
        this.newPostBtn = document.getElementById('new-post-btn');
    }

    addEventListeners() {
        this.newPostBtn.addEventListener('click', () => this.showPostModal());
        document.getElementById('submit-post').addEventListener('click', () => this.createPost());
    }

    showPostModal() {
        this.postModal.classList.remove('hidden');
    }

    hidePostModal() {
        this.postModal.classList.add('hidden');
    }

    async createPost() {
        if (!auth.currentUser) {
            alert('Please login to create a post');
            return;
        }

        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const mediaFile = document.getElementById('post-media').files[0];

        let mediaUrl = null;
        if (mediaFile) {
            const { data, error } = await supabase.storage
                .from('post-media')
                .upload(`${Date.now()}-${mediaFile.name}`, mediaFile);

            if (error) {
                alert('Error uploading media');
                return;
            }
            mediaUrl = data.path;
        }

        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    title,
                    content,
                    media_url: mediaUrl,
                    user_id: auth.currentUser.id,
                    thread_id: currentThreadId // This should be set when viewing a thread
                }
            ]);

        if (error) {
            alert('Error creating post');
        } else {
            this.hidePostModal();
            this.loadPosts(currentThreadId);
        }
    }

    async loadPosts(threadId) {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                profiles:user_id(username),
                likes:post_likes(count),
                dislikes:post_dislikes(count),
                comments:post_comments(count)
            `)
            .eq('thread_id', threadId)
            .order('created_at', { ascending: false });

        if (error) {
            alert('Error loading posts');
            return;
        }

        this.renderPosts(data);
    }

    renderPosts(posts) {
        this.postsList.innerHTML = '';
        posts.forEach(post => {
            const postElement = this.createPostElement(post);
            this.postsList.appendChild(postElement);
        });
    }

    createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post-item';
        
        let mediaContent = '';
        if (post.media_url) {
            if (post.media_url.match(/\.(jpg|jpeg|png|gif)$/i)) {
                mediaContent = `<img src="${post.media_url}" alt="Post media">`;
            } else if (post.media_url.match(/\.(mp4|webm)$/i)) {
                mediaContent = `<video controls><source src="${post.media_url}"></video>`;
            }
        }

        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            ${mediaContent}
            <div class="post-meta">
                <span>Posted by ${post.profiles.username}</span>
                <span>${new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <div class="interaction-controls">
                <button onclick="interactions.likePost(${post.id})">
                    👍 ${post.likes[0]?.count || 0}
                </button>
                <button onclick="interactions.dislikePost(${post.id})">
                    👎 ${post.dislikes[0]?.count || 0}
                </button>
                <button onclick="interactions.showComments(${post.id})">
                    💬 ${post.comments[0]?.count || 0}
                </button>
            </div>
            <div id="comments-${post.id}" class="comments-section hidden"></div>
        `;

        return postDiv;
    }
}

const posts = new Posts(); 
