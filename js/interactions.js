class Interactions {
    async likePost(postId) {
        if (!auth.currentUser) {
            alert('Please login to like posts');
            return;
        }

        const { data, error } = await supabase
            .from('post_likes')
            .upsert([
                {
                    post_id: postId,
                    user_id: auth.currentUser.id
                }
            ]);

        if (error) {
            alert('Error liking post');
        } else {
            posts.loadPosts(currentThreadId);
        }
    }

    async dislikePost(postId) {
        if (!auth.currentUser) {
            alert('Please login to dislike posts');
            return;
        }

        const { data, error } = await supabase
            .from('post_dislikes')
            .upsert([
                {
                    post_id: postId,
                    user_id: auth.currentUser.id
                }
            ]);

        if (error) {
            alert('Error disliking post');
        } else {
            posts.loadPosts(currentThreadId);
        }
    }

    async showComments(postId) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        commentsSection.classList.toggle('hidden');

        if (!commentsSection.classList.contains('hidden')) {
            const { data: comments, error } = await supabase
                .from('post_comments')
                .select(`
                    *,
                    profiles:user_id(username)
                `)
                .eq('post_id', postId)
                .order('created_at', { ascending: true });

            if (error) {
                alert('Error loading comments');
                return;
            }

            this.renderComments(postId, comments);
        }
    }

    renderComments(postId, comments) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        commentsSection.innerHTML = `
            <div class="comments-list">
                ${comments.map(comment => this.createCommentElement(comment)).join('')}
            </div>
            ${auth.currentUser ? this.createCommentForm(postId) : ''}
        `;
    }

    createCommentElement(comment) {
        return `
            <div class="comment">
                <p>${comment.content}</p>
                <div class="comment-meta">
                    <span>${comment.profiles.username}</span>
                    <span>${new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    }

    createCommentForm(postId) {
        return `
            <div class="comment-form">
                <textarea id="comment-content-${postId}" placeholder="Write a comment..."></textarea>
                <button onclick="interactions.submitComment(${postId})">Submit</button>
            </div>
        `;
    }

    async submitComment(postId) {
        if (!auth.currentUser) {
            alert('Please login to comment');
            return;
        }

        const content = document.getElementById(`comment-content-${postId}`).value;

        const { data, error } = await supabase
            .from('post_comments')
            .insert([
                {
                    post_id: postId,
                    user_id: auth.currentUser.id,
                    content
                }
            ]);

        if (error) {
            alert('Error submitting comment');
        } else {
            this.showComments(postId);
        }
    }
}

const interactions = new Interactions(); 
