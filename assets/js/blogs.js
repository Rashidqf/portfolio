// Blog Management System
class BlogManager {
    constructor() {
        this.blogsData = null;
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.filteredBlogs = [];
        
        this.init();
    }

    async init() {
        try {
            await this.loadBlogData();
            this.setupEventListeners();
            this.renderCategories();
            this.renderRecentPosts();
            this.renderBlogs();
            this.renderPagination();
        } catch (error) {
            console.error('Error initializing blog manager:', error);
        }
    }

    async loadBlogData() {
        try {
            const response = await fetch('assets/js/blogs-data.json');
            this.blogsData = await response.json();
            this.filteredBlogs = [...this.blogsData.blogs];
        } catch (error) {
            console.error('Error loading blog data:', error);
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchForm = document.querySelector('.search-widgets-box');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const searchInput = searchForm.querySelector('input[type="search"]');
                this.searchQuery = searchInput.value.trim();
                this.filterBlogs();
            });
        }

        // Category filter
        document.addEventListener('click', (e) => {
            if (e.target.closest('.catagory-item-list a')) {
                e.preventDefault();
                const categoryId = e.target.closest('a').getAttribute('data-category');
                this.currentCategory = categoryId;
                this.currentPage = 1;
                this.filterBlogs();
            }
        });

        // Pagination
        document.addEventListener('click', (e) => {
            if (e.target.closest('.pagination-nav-list a')) {
                e.preventDefault();
                const pageLink = e.target.closest('a');
                const pageText = pageLink.textContent.trim();
                
                if (pageText === '‹' || pageText === '‹‹') {
                    // Previous page
                    if (this.currentPage > 1) {
                        this.currentPage--;
                        this.renderBlogs();
                        this.renderPagination();
                    }
                } else if (pageText === '›' || pageText === '››') {
                    // Next page
                    const totalPages = Math.ceil(this.filteredBlogs.length / this.itemsPerPage);
                    if (this.currentPage < totalPages) {
                        this.currentPage++;
                        this.renderBlogs();
                        this.renderPagination();
                    }
                } else if (!isNaN(pageText)) {
                    // Specific page number
                    this.currentPage = parseInt(pageText);
                    this.renderBlogs();
                    this.renderPagination();
                }
            }
        });
    }

    filterBlogs() {
        this.filteredBlogs = this.blogsData.blogs.filter(blog => {
            const matchesCategory = this.currentCategory === 'all' || blog.category === this.currentCategory;
            const matchesSearch = this.searchQuery === '' || 
                blog.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                blog.excerpt.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                blog.categoryName.toLowerCase().includes(this.searchQuery.toLowerCase());
            
            return matchesCategory && matchesSearch;
        });

        this.currentPage = 1;
        this.renderBlogs();
        this.renderPagination();
        this.updateCategoryCounts();
    }

    updateCategoryCounts() {
        const categoryLinks = document.querySelectorAll('.catagory-item-list a');
        categoryLinks.forEach(link => {
            const categoryId = link.getAttribute('data-category');
            if (categoryId === 'all') {
                const count = this.blogsData.blogs.length;
                link.querySelector('.count').textContent = `(${count})`;
            } else {
                const count = this.blogsData.blogs.filter(blog => blog.category === categoryId).length;
                link.querySelector('.count').textContent = `(${count})`;
            }
        });
    }

    renderCategories() {
        const categoryContainer = document.querySelector('.catagory-item-list');
        if (!categoryContainer) return;

        // Add "All Categories" option
        let categoriesHTML = `
            <li><a href="#" data-category="all">
                <span class="text">All Categories</span>
                <span class="count">(${this.blogsData.blogs.length})</span>
                <span class="icon"><i class="icofont-double-right"></i></span>
            </a></li>
        `;

        // Add individual categories
        this.blogsData.categories.forEach(category => {
            const count = this.blogsData.blogs.filter(blog => blog.category === category.id).length;
            categoriesHTML += `
                <li><a href="#" data-category="${category.id}">
                    <span class="text">${category.name}</span>
                    <span class="count">(${count})</span>
                    <span class="icon"><i class="icofont-double-right"></i></span>
                </a></li>
            `;
        });

        categoryContainer.innerHTML = categoriesHTML;
    }

    renderRecentPosts() {
        const recentPostsContainer = document.querySelector('.recent-blog-item-list');
        if (!recentPostsContainer) return;

        let recentPostsHTML = '';
        this.blogsData.recentPosts.forEach(post => {
            const formattedDate = this.formatDate(post.date);
            const blogUrl = post.file ? `blog/${post.file}` : `blog-details.html?id=${post.id}`;
            recentPostsHTML += `
                <li>
                    <a href="${blogUrl}" class="image">
                        <img src="${post.image}" alt="${post.title}">
                    </a>
                    <div class="content">
                        <h4 class="title"><a href="${blogUrl}">${post.title}</a></h4>
                        <div class="post-meta">
                            <a href="#" class="date icon-space-right">
                                <i class="icofont-calendar"></i> ${formattedDate}
                            </a>
                        </div>
                    </div>
                </li>
            `;
        });

        recentPostsContainer.innerHTML = recentPostsHTML;
    }

    renderBlogs() {
        const blogContainer = document.querySelector('.blog-list');
        if (!blogContainer) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const blogsToShow = this.filteredBlogs.slice(startIndex, endIndex);

        if (blogsToShow.length === 0) {
            blogContainer.innerHTML = `
                <div class="text-center py-5">
                    <h3>No blogs found</h3>
                    <p>Try adjusting your search or category filter.</p>
                </div>
            `;
            return;
        }

        let blogsHTML = '';
        blogsToShow.forEach(blog => {
            const formattedDate = this.formatDate(blog.date);
            const blogUrl = blog.file ? `blog/${blog.file}` : `blog-details.html?id=${blog.id}`;
            blogsHTML += `
                <div class="blog-list-single-item">
                    <div class="inner-shape inner-shape-top-right"></div>
                    <a href="${blogUrl}" class="image">
                        <img src="${blog.image}" alt="${blog.title}">
                    </a>
                    <div class="content">
                        <div class="post-meta-1">
                            <a href="#" class="catagory">${blog.categoryName}</a>
                            <a href="#" class="date">${formattedDate}</a>
                        </div>
                        <h4 class="title"><a href="${blogUrl}">${blog.title}</a></h4>
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

        blogContainer.innerHTML = blogsHTML;
    }

    renderPagination() {
        const paginationContainer = document.querySelector('.pagination-nav-list');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredBlogs.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <li class="prev ${this.currentPage === 1 ? 'disabled' : ''}">
                <a href="#" ${this.currentPage === 1 ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
                    <i class="icofont-double-left"></i>
                </a>
            </li>
        `;

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <li class="${i === this.currentPage ? 'active' : ''}">
                    <a href="#">${i}</a>
                </li>
            `;
        }

        // Next button
        paginationHTML += `
            <li class="next ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a href="#" ${this.currentPage === totalPages ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
                    <i class="icofont-double-right"></i>
                </a>
            </li>
        `;

        paginationContainer.innerHTML = paginationHTML;
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

// Initialize the blog manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
}); 