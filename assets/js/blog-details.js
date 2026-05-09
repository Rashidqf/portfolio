// Blog Details Management System
class BlogDetailsManager {
    constructor() {
        this.blogsData = null;
        this.currentBlog = null;
        this.relatedBlogs = [];
        
        this.init();
    }

    async init() {
        try {
            await this.loadBlogData();
            this.loadBlogDetails();
            this.renderRelatedBlogs();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing blog details manager:', error);
        }
    }

    async loadBlogData() {
        try {
            const response = await fetch('assets/js/blogs-data.json');
            this.blogsData = await response.json();
        } catch (error) {
            console.error('Error loading blog data:', error);
        }
    }

    loadBlogDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const blogId = parseInt(urlParams.get('id'));
        
        if (!blogId) {
            this.showError('Blog ID not found');
            return;
        }

        this.currentBlog = this.blogsData.blogs.find(blog => blog.id === blogId);
        
        if (!this.currentBlog) {
            this.showError('Blog not found');
            return;
        }

        this.renderBlogDetails();
        this.updatePageTitle();
        this.findRelatedBlogs();
    }

    renderBlogDetails() {
        const blogContainer = document.querySelector('.blog-details-content');
        if (!blogContainer) return;

        const formattedDate = this.formatDate(this.currentBlog.date);
        
        const blogHTML = `
            <div class="blog-details-content-inner">
                <div class="blog-details-meta">
                    <div class="post-meta-1">
                        <a href="#" class="catagory">${this.currentBlog.categoryName}</a>
                        <a href="#" class="date">${formattedDate}</a>
                    </div>
                    <div class="post-meta-2">
                        <a href="#" class="icon-space-right">
                            <i class="icofont-ui-user"></i>${this.currentBlog.author}
                        </a>
                        <a href="#" class="icon-space-right">
                            <i class="icofont-heart"></i>${this.formatNumber(this.currentBlog.likes)}
                        </a>
                        <a href="#" class="icon-space-right">
                            <i class="icofont-speech-comments"></i>${this.formatNumber(this.currentBlog.comments)}
                        </a>
                    </div>
                </div>
                
                <h2 class="title">${this.currentBlog.title}</h2>
                
                <div class="blog-details-image">
                    <img src="${this.currentBlog.image}" alt="${this.currentBlog.title}">
                </div>
                
                <div class="blog-details-content-text">
                    <p>${this.currentBlog.excerpt}</p>
                    <p>${this.currentBlog.content}</p>
                    
                    <!-- Add more content paragraphs here -->
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    
                    <h3>Key Takeaways</h3>
                    <ul>
                        <li>Understanding the fundamentals of ${this.currentBlog.categoryName}</li>
                        <li>Best practices and implementation strategies</li>
                        <li>Common pitfalls to avoid</li>
                        <li>Future trends and developments</li>
                    </ul>
                    
                    <p>This comprehensive guide provides insights into ${this.currentBlog.categoryName.toLowerCase()} and how it can benefit your projects. Whether you're a beginner or an experienced developer, there's something valuable to learn from this article.</p>
                </div>
                
                <div class="blog-details-tags">
                    <h4>Tags:</h4>
                    <div class="tag-list">
                        <a href="#" class="tag">${this.currentBlog.categoryName}</a>
                        <a href="#" class="tag">Development</a>
                        <a href="#" class="tag">Technology</a>
                        <a href="#" class="tag">Design</a>
                    </div>
                </div>
            </div>
        `;

        blogContainer.innerHTML = blogHTML;
    }

    findRelatedBlogs() {
        // Find blogs in the same category, excluding current blog
        this.relatedBlogs = this.blogsData.blogs
            .filter(blog => blog.category === this.currentBlog.category && blog.id !== this.currentBlog.id)
            .slice(0, 3); // Show only 3 related blogs
    }

    renderRelatedBlogs() {
        const relatedContainer = document.querySelector('.related-blog-list');
        if (!relatedContainer || this.relatedBlogs.length === 0) return;

        let relatedHTML = '';
        this.relatedBlogs.forEach(blog => {
            const formattedDate = this.formatDate(blog.date);
            const relatedUrl = blog.file ? `/blog/${blog.file}` : `/blog-details?id=${blog.id}`;
            relatedHTML += `
                <div class="blog-list-single-item">
                    <div class="inner-shape inner-shape-top-right"></div>
                    <a href="${relatedUrl}" class="image">
                        <img src="${blog.image}" alt="${blog.title}">
                    </a>
                    <div class="content">
                        <div class="post-meta-1">
                            <a href="#" class="catagory">${blog.categoryName}</a>
                            <a href="#" class="date">${formattedDate}</a>
                        </div>
                        <h4 class="title"><a href="${relatedUrl}">${blog.title}</a></h4>
                        <p class="excerpt">${blog.excerpt}</p>
                        <div class="post-meta-2">
                            <a href="#" class="icon-space-right">
                                <i class="icofont-ui-user"></i>${blog.author}
                            </a>
                            <a href="#" class="icon-space-right">
                                <i class="icofont-heart"></i>${this.formatNumber(blog.likes)}
                            </a>
                            <a href="#" class="icon-space-right">
                                <i class="icofont-speech-comments"></i>${this.formatNumber(blog.comments)}
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });

        relatedContainer.innerHTML = relatedHTML;
    }

    updatePageTitle() {
        if (this.currentBlog) {
            document.title = `${this.currentBlog.title} - Rashid's Portfolio`;
        }
    }

    showError(message) {
        const blogContainer = document.querySelector('.blog-details-content');
        if (blogContainer) {
            blogContainer.innerHTML = `
                <div class="text-center py-5">
                    <h3>Error</h3>
                    <p>${message}</p>
                    <a href="/blogs" class="btn btn-primary">Back to Blogs</a>
                </div>
            `;
        }
    }

    setupEventListeners() {
        // Add any additional event listeners here
        // For example, social sharing, comments, etc.
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Initialize the blog details manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogDetailsManager();
}); 