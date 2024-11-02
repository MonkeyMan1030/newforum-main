class Threads {
    constructor() {
        this.initializeElements();
        this.addEventListeners();
        this.loadCategories();
        this.loadThreads();
    }

    initializeElements() {
        this.threadsList = document.getElementById('threads-list');
        this.threadFilter = document.getElementById('thread-filter');
        this.newThreadBtn = document.getElementById('new-thread-btn');
    }

    addEventListeners() {
        this.newThreadBtn.addEventListener('click', () => this.showNewThreadModal());
        this.threadFilter.addEventListener('change', () => this.loadThreads());
    }

    async loadCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*');

        if (error) {
            alert('Error loading categories');
            return;
        }

        this.threadFilter.innerHTML = '<option value="all">All Categories</option>';
        data.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            this.threadFilter.appendChild(option);
        });
    }

    async loadThreads() {
        const category = this.threadFilter.value;
        let query = supabase
            .from('threads')
            .select(`
                *,
                profiles:user_id(username),
                categories:category_id(name),
                posts:posts(count)
            `)
            .order('created_at', { ascending: false });

        if (category !== 'all') {
            query = query.eq('category_id', category);
        }

        const { data, error } = await query;

        if (error) {
            alert('Error loading threads');
            return;
        }

        this.renderThreads(data);
    }

    renderThreads(threads) {
        this.threadsList.innerHTML = '';
        threads.forEach(thread => {
            const threadElement = this.createThreadElement(thread);
            this.threadsList.appendChild(threadElement);
        });
    }

    createThreadElement(thread) {
        const threadDiv = document.createElement('div');
        threadDiv.className = 'thread-item';
        threadDiv.innerHTML = `
            <h3>${thread.title}</h3>
            <p>${thread.description}</p>
            <div class="thread-meta">
                <span>Created by ${thread.profiles.username}</span>
                <span>Category: ${thread.categories.name}</span>
                <span>Posts: ${thread.posts[0]?.count || 0}</span>
                <span>${new Date(thread.created_at).toLocaleDateString()}</span>
            </div>
            <button onclick="threads.viewThread(${thread.id})">View Thread</button>
        `;
        return threadDiv;
    }

    async viewThread(threadId) {
        // Hide threads section and show posts section
        document.getElementById('threads-section').classList.add('hidden');
        document.getElementById('posts-section').classList.remove('hidden');
        
        // Load posts for this thread
        await posts.loadPosts(threadId);
    }
}

const threads = new Threads(); 
