(function($) {
    "use strict";

    /*****************************
     * Commons Variables
     *****************************/
    var $window = $(window),
        $body = $('body');

    /****************************
     * Sticky Menu
     *****************************/
    $(window).on('scroll', function() {
        var scroll = $(window).scrollTop();
        if (scroll < 100) {
            $(".sticky-header").removeClass("sticky");
        } else {
            $(".sticky-header").addClass("sticky");
        }
    });


    /*****************************
     * Off Canvas Function
     *****************************/
    (function() {
        var $offCanvasToggle = $('.offcanvas-toggle'),
            $offCanvas = $('.offcanvas'),
            $offCanvasOverlay = $('.offcanvas-overlay'),
            $mobileMenuToggle = $('.mobile-menu-toggle');
        $offCanvasToggle.on('click', function(e) {
            e.preventDefault();
            var $this = $(this),
                $target = $this.attr('href');
            $body.addClass('offcanvas-open');
            $($target).addClass('offcanvas-open');
            $offCanvasOverlay.fadeIn();
            if ($this.parent().hasClass('mobile-menu-toggle')) {
                $this.addClass('close');
            }
        });
        $('.offcanvas-close, .offcanvas-overlay').on('click', function(e) {
            e.preventDefault();
            $body.removeClass('offcanvas-open');
            $offCanvas.removeClass('offcanvas-open');
            $offCanvasOverlay.fadeOut();
            $mobileMenuToggle.find('a').removeClass('close');
        });
    })();


    /**************************
     * Offcanvas: Menu Content
     **************************/
    function mobileOffCanvasMenu() {
        var $offCanvasNav = $('.offcanvas-menu'),
            $offCanvasNavSubMenu = $offCanvasNav.find('.mobile-sub-menu');

        /*Add Toggle Button With Off Canvas Sub Menu*/
        $offCanvasNavSubMenu.parent().prepend('<div class="offcanvas-menu-expand"></div>');

        /*Category Sub Menu Toggle*/
        $offCanvasNav.on('click', 'li a, .offcanvas-menu-expand', function(e) {
            var $this = $(this);
            if ($this.attr('href') === '#' || $this.hasClass('offcanvas-menu-expand')) {
                e.preventDefault();
                if ($this.siblings('ul:visible').length) {
                    $this.parent('li').removeClass('active');
                    $this.siblings('ul').slideUp();
                    $this.parent('li').find('li').removeClass('active');
                    $this.parent('li').find('ul:visible').slideUp();
                } else {
                    $this.parent('li').addClass('active');
                    $this.closest('li').siblings('li').removeClass('active').find('li').removeClass('active');
                    $this.closest('li').siblings('li').find('ul:visible').slideUp();
                    $this.siblings('ul').slideDown();
                }
            }
        });
    }
    mobileOffCanvasMenu();

    /****************************************
     *   Service Slider
     *****************************************/
        var service_display_slider = new Swiper('.service-display-slider .swiper-container', {
            slidesPerView: 3,
            speed: 1500,
            loop: true,
            spaceBetween: 45,
            pagination: {
                el: '.service-display-dots .swiper-pagination',
                clickable: true,
              },
    
            breakpoints: {
    
                320: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1200: {
                    slidesPerView: 3,
                },
                
            }
        });


   /****************************************
    *  Project Slider 
    *****************************************/
    var project_display_slider = new Swiper('.project-display-slider .swiper-container', {
        spaceBetween: 50,
        effect: 'slide',
        speed: 1500,
        // Navigation arrows
        navigation: {
            nextEl: '.project-display-box .button-next',
            prevEl: '.project-display-box .button-prev',
        },

        breakpoints: {

            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 2,
            },
            1800: {
                centeredSlides: true,
                slidesPerView: 3,
            }
            
        }
      });

   /****************************************
    *  Testimonial Slider
    *****************************************/
    var testimonial_display_slider = new Swiper('.testimonial-display-slider .swiper-container', {
        slidesPerView: 2,
        loop: true,
        // Navigation arrows
        navigation: {
            nextEl: '.testimonial-display-box .button-next',
            prevEl: '.testimonial-display-box .button-prev',
        },

        breakpoints: {

            0: {
                slidesPerView: 1,
            },
            992: {
                spaceBetween: 80,
                slidesPerView: 2,
            },
            1200: {
                spaceBetween: 100,
            },
            1400: {
                spaceBetween: 150,
            },
            1800: {
                spaceBetween: 175,
            }
            
        }
      });

   /****************************************
    *  Company Logo Slider
    *****************************************/
    var company_logo_display_slider = new Swiper('.company-logo-display-slider .swiper-container', {
        slidesPerView: 4,
        loop: true,

        breakpoints: {

            0: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 2,
                spaceBetween:50,
            },
            576: {
                slidesPerView: 2,
                spaceBetween:50,
            },
            768: {
                slidesPerView: 3,
                spaceBetween:50,
            },
            992: {
                slidesPerView: 3,
                spaceBetween:60,
            },
            1200: {
                slidesPerView: 4,
                spaceBetween: 85,
            }
        }
      });

   /****************************************
    *  Project Details Slider (per-project pages)
    *****************************************/
    var project_details_slider = new Swiper('.project-details-slider .swiper-container', {
        slidesPerView: 1,
        loop: true,
        speed: 900,
        spaceBetween: 16,
        effect: 'slide',
        pagination: {
            el: '.project-details-slider .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.project-details-slider .button-next',
            prevEl: '.project-details-slider .button-prev',
        },
        preloadImages: false,
        lazy: {
            loadPrevNext: true,
        },
    });

      
    /************************************************
     * Counter Up
     ***********************************************/
    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });

    /************************************************
     * Video  Popup
     ***********************************************/
    $('.wave-btn').venobox(); 

    /************************************************
     * Project Filter
     ***********************************************/
      $('.projects-wrapper-gallery-content').imagesLoaded( function() {
         $('.projects-gallery-filter-nav').on( 'click', 'button', function() {
            var filterValue = $(this).attr('data-filter');
            $grid.isotope({ filter: filterValue });
             
            $(this).siblings('.active').removeClass('active');
            $(this).addClass('active');
         });

        var $grid = $('.projects-wrapper-gallery-content').isotope({
            itemSelector: '.filter-item',
             percentPosition: true,
         });
     });


     /************************************************
     * Progressbar
     ***********************************************/
      if($('.progress-line').length){
        $('.progress-line').appear(function(){
            var el = $(this);
            var percent = el.data('width');
            $(el).css('width',percent+'%');
        },{accY: 0});
    };

    /************************************************
     * Scroll Top
     ***********************************************/
    $('body').materialScrollTop();

    /************************************************
     * Lazy-load marked.js (only when AI chat needs markdown)
     ***********************************************/
    var markedLoadPromise = null;
    function loadMarked() {
        if (typeof marked !== 'undefined') {
            return Promise.resolve();
        }
        if (!markedLoadPromise) {
            markedLoadPromise = new Promise(function(resolve, reject) {
                var script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
                script.defer = true;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        return markedLoadPromise;
    }

    /************************************************
     * Chat Widget Functionality with AI Integration
     ***********************************************/
    (function() {
        const chatIcon = document.getElementById('chatIcon');
        if (!chatIcon) {
            return;
        }
        const chatModal = document.getElementById('chatModal');
        const chatClose = document.getElementById('chatClose');
        const chatMinimize = document.getElementById('chatMinimize');
        const messageInput = document.getElementById('messageInput');
        const sendMessage = document.getElementById('sendMessage');
        const chatMessages = document.getElementById('chatMessages');
        const chatNotification = document.querySelector('.chat-notification');

        // Website links configuration and sitemap support
        const SITE_BASE = 'https://rashidyousufzai.netlify.app';
        const defaultLinks = {
            home: SITE_BASE + '/',
            contact: SITE_BASE + '/contact',
            projectList: SITE_BASE + '/project-list',
            resume: SITE_BASE + '/assets/Rashidmern.pdf'
        };
        let sitemapLinks = [];
        // Try to load links from on-site sitemap.xml (same-origin)
        try {
            fetch('/sitemap.xml')
                .then(function(res) { return res.ok ? res.text() : ''; })
                .then(function(xmlText) {
                    if (!xmlText) return;
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(xmlText, 'application/xml');
                    var locs = doc.getElementsByTagName('loc');
                    sitemapLinks = Array.prototype.map.call(locs, function(node) {
                        return (node.textContent || '').trim();
                    }).filter(Boolean);
                })
                .catch(function(){ /* ignore */ });
        } catch(_) { /* ignore */ }

        // AI API Configuration - Using Netlify Function for security
        const AI_API_URL = '/.netlify/functions/ai-chat';

        // Rashid's comprehensive profile data for AI context
        const rashidProfile = {
            name: "Muhammad Rashid Khan (Rashid Yousufzai)",
            profession: "Full Stack & Mobile App Developer",
            location: "Karachi, Pakistan",
            contact: {
                phone: "+92 310 287 0579",
                email: "iamrashidyousufzai@gmail.com",
                address: "Rehmat Chowk, Orangi Town, Karachi, Pakistan"
            },
            education: [
                {
                    degree: "Bachelor's degree, Computer Science",
                    institution: "Sindh Maddressatul Islam University",
                    period: "2020 — 2024"
                },
                {
                    degree: "Web and Hybrid mobile app development",
                    institution: "Saylani Mass and IT training(SMIT)",
                    period: "2022 — 2023"
                },
                {
                    degree: "Intermediate in Computer Science",
                    institution: "Govt College Formem Nazimabad",
                    period: "2017 — 2019"
                }
            ],
            experience: [
                {
                    position: "Full Stack Developer",
                    company: "QF NETWORK",
                    period: "04/2024 — Present",
                    description: "Engineered scalable web and mobile applications tailored to user needs. Optimized performance by implementing best coding practices and modern frameworks."
                },
                {
                    position: "Full Stack Developer",
                    company: "NEXT GEN SOLUTION",
                    period: "12/2023 — 03/2024",
                    description: "Designed and deployed robust applications with seamless user experiences. Integrated APIs and third-party services to extend functionality."
                },
                {
                    position: "MERN Stack Developer",
                    company: "EYECHECK AI",
                    period: "05/2023 — 11/2023",
                    description: "Developed healthcare diagnostic tools and intelligent automation systems using AI/ML technologies."
                },
                {
                    position: "WordPress Developer",
                    company: "PRIME VALLEY",
                    period: "03/2022 — 02/2023",
                    description: "Built custom WordPress websites and e-commerce solutions for various clients."
                }
            ],
            skills: {
                frontend: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "HTML5/CSS3"],
                backend: ["Node.js", "Express.js", "Python", "Laravel", "PHP"],
                database: ["MongoDB", "MySQL", "PostgreSQL"],
                mobile: ["React Native", "Hybrid Mobile Apps"],
                ai_ml: ["OpenAI API", "LangChain", "Custom AI Models", "Machine Learning"],
                ecommerce: ["WordPress", "Shopify", "E-commerce Platforms"],
                tools: ["Git", "Docker", "AWS", "Vercel", "Netlify"]
            },
            expertise: {
                mern: "75%",
                wordpress: "70%",
                shopify: "70%",
                mobile_apps: "70%"
            },
            projects: [
                {
                    name: "SpeakSmart",
                    type: "AI-Powered Real-Time English Conversation Platform",
                    tech: ["React.js", "OpenAI API", "Flask"],
                    description: "AI-powered real-time English conversation platform with voice recognition and speech-to-text capabilities."
                },
                {
                    name: "Pocket Coach AI",
                    type: "Business Idea Development Platform",
                    tech: ["Next.js", "OpenAI API", "MongoDB"],
                    description: "AI-powered business idea development and coaching platform with automated insights."
                },
                {
                    name: "AI Recruitment Automation",
                    type: "Recruitment Middleware",
                    tech: ["Python", "FastAPI", "Azure OpenAI"],
                    description: "Advanced middleware solution for intelligent recruitment with Azure OpenAI integration."
                },
                {
                    name: "Instagram Analytics",
                    type: "Analytics Dashboard",
                    tech: ["React.js", "Node.js", "Instagram API"],
                    description: "Comprehensive analytics dashboard for Instagram business insights."
                },
                {
                    name: "Daylily AI Assistant",
                    type: "3D AI Sales Assistant",
                    tech: ["React.js", "Langbase", "Heygen"],
                    description: "Interactive 3D AI sales assistant for Shopify stores."
                },
                {
                    name: "Custom Bead Designer",
                    type: "3D Design Tool",
                    tech: ["React.js", "Three.js", "PostgreSQL"],
                    description: "Interactive 3D bead designer with Shopify integration."
                },
                {
                    name: "AI Product Designer",
                    type: "Shopify AI Tool",
                    tech: ["React", "DALL-E 3", "TypeScript"],
                    description: "AI-powered product customization tool for Shopify."
                },
                {
                    name: "Trading Automation",
                    type: "Trading Platform",
                    tech: ["Express.js", "React.js", "Python", "Selenium"],
                    description: "Automated trading platform with real-time data processing."
                },
                {
                    name: "Custom Patches",
                    type: "E-commerce Platform",
                    tech: ["Laravel", "MySQL", "PHP"],
                    description: "Dynamic patch ordering system with file uploads and admin dashboard."
                },
                {
                    name: "Digital Patches",
                    type: "Embroidery Platform",
                    tech: ["Laravel", "MySQL"],
                    description: "Embroidery patch customization and ordering platform."
                },
                {
                    name: "Online Book Service",
                    type: "Publishing Platform",
                    tech: ["Laravel", "MySQL"],
                    description: "Comprehensive book publishing and writing services platform."
                },
                {
                    name: "Hoor Fashion",
                    type: "E-commerce Store",
                    tech: ["WordPress", "Elementor"],
                    description: "Online fashion e-commerce store with modern design."
                }
            ],
            services: [
                "Web Design & Development",
                "Mobile App Development", 
                "Shopify App Development",
                "UI/UX Design",
                "AI/ML-enabled Web Solutions",
                "E-commerce Development",
                "WordPress Development",
                "API Integration",
                "Database Design",
                "Performance Optimization"
            ],
            social_links: {
                facebook: "https://www.facebook.com/RashidYousufZa/",
                github: "https://github.com/Rashidqf",
                linkedin: "https://www.linkedin.com/in/rashidyousufzai/",
                instagram: "https://www.instagram.com/rashid.yousufzai/",
                twitter: "https://x.com/RashidYousufZa3"
            }
        };

        let isMinimized = false;
        let conversationHistory = [];

        // Function to handle responsive modal positioning
        function updateModalPosition() {
            if (window.innerWidth <= 768) {
                // Mobile positioning
                chatModal.style.position = 'fixed';
                chatModal.style.top = '0';
                chatModal.style.left = '0';
                chatModal.style.right = '0';
                chatModal.style.bottom = '0';
                chatModal.style.width = '100%';
                chatModal.style.height = '100%';
                chatModal.style.maxWidth = '100%';
                chatModal.style.maxHeight = '100%';
                chatModal.style.borderRadius = '0';
                chatModal.style.margin = '0';
            } else {
                // Desktop positioning
                chatModal.style.position = 'fixed';
                chatModal.style.top = '50%';
                chatModal.style.left = '50%';
                chatModal.style.transform = 'translate(-50%, -50%)';
                chatModal.style.width = '400px';
                chatModal.style.height = '600px';
                chatModal.style.maxWidth = '90vw';
                chatModal.style.maxHeight = '90vh';
                chatModal.style.borderRadius = '12px';
                chatModal.style.margin = '0';
            }
        }

        // Open chat modal
        chatIcon.addEventListener('click', function() {
            chatModal.classList.add('active'); 
            chatNotification.style.display = 'none';
            messageInput.focus();
            updateModalPosition();
        });

        // Close chat modal
        chatClose.addEventListener('click', function() {
            chatModal.classList.remove('active');
            chatModal.classList.remove('minimized');
            isMinimized = false;
        });

        // Minimize chat modal
        chatMinimize.addEventListener('click', function() {
            if (isMinimized) {
                chatModal.classList.remove('minimized');
                isMinimized = false;
                updateModalPosition();
            } else {
                chatModal.classList.add('minimized');
                isMinimized = true;
                // Minimized state positioning
                if (window.innerWidth <= 768) {
                    chatModal.style.position = 'fixed';
                    chatModal.style.bottom = '80px';
                    chatModal.style.right = '20px';
                    chatModal.style.top = 'auto';
                    chatModal.style.left = 'auto';
                    chatModal.style.transform = 'none';
                    chatModal.style.width = '300px';
                    chatModal.style.height = '400px';
                    chatModal.style.maxWidth = '90vw';
                    chatModal.style.maxHeight = '60vh';
                } else {
                    chatModal.style.position = 'fixed';
                    chatModal.style.bottom = '100px';
                    chatModal.style.right = '30px';
                    chatModal.style.top = 'auto';
                    chatModal.style.left = 'auto';
                    chatModal.style.transform = 'none';
                    chatModal.style.width = '350px';
                    chatModal.style.height = '500px';
                }
            }
        });

        // Send message function
        function sendUserMessage(message) {
            const messageElement = document.createElement('div');
            messageElement.className = 'message sent';
            messageElement.innerHTML = `
                <div class="message-content">
                    <p>${message}</p>
                    <span class="message-time">${getCurrentTime()}</span>
                </div>
            `;
            chatMessages.appendChild(messageElement);
            // Auto-scroll to bottom for better UX
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // AI Response function
        async function getAIResponse(userMessage) {
            try {
                // Add user message to conversation history
                conversationHistory.push({
                    role: "user",
                    content: userMessage
                });

                // Create system prompt with Rashid's profile
                const systemPrompt = `You are an AI assistant that answers questions based on the following profile:

Name: ${rashidProfile.name}
Profession: ${rashidProfile.profession} from ${rashidProfile.location}.
Skills: MERN Stack, WordPress, Shopify, AI/ML Integration (OpenAI API, LangChain, custom models), Mobile-first Responsive Design.

Education:
${rashidProfile.education.map(edu => `- ${edu.degree} (${edu.institution}, ${edu.period})`).join('\n')}

Experience:
${rashidProfile.experience.map(exp => `- ${exp.company} (${exp.position}, ${exp.period}) - ${exp.description}`).join('\n')}

Services: ${rashidProfile.services.join(', ')}.

Projects: ${rashidProfile.projects.map(proj => `${proj.name} - ${proj.description} (${proj.tech.join(', ')})`).join('; ')}.

Contact: ${rashidProfile.contact.phone}, ${rashidProfile.contact.email}, ${rashidProfile.contact.address}.

IMPORTANT: Always format your responses using markdown syntax. Use:
- **bold** for emphasis
- *italic* for secondary emphasis
- \`code\` for technical terms
- \`\`\` for code blocks
- - for bullet points
- ### for section headers
                - [link text](url) for links

Additionally: Keep responses concise and focused on the information requested. Do not include external links or URLs in your responses.

Answer every user question as if you are Rashid, using only the information above unless asked for general knowledge. Be helpful, professional, and conversational. Keep responses concise but informative. Always use markdown formatting to make responses more readable and professional.`;

                // Prepare API request
                const requestBody = {
                    model: "gemini-2.0-flash-lite", // Using Gemini 2.0 Flash Lite for faster responses
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        ...conversationHistory.slice(-5) // Keep last 5 messages for context
                    ],
                    stream: false,
                    temperature: 0.7, // Control response creativity
                    max_tokens: 2048 // Limit response length
                };

                // Show typing indicator
                const typingElement = document.createElement('div');
                typingElement.className = 'message received typing';
                typingElement.innerHTML = `
                    <div class="message-content">
                        <div class="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span class="message-time">Typing...</span>
                    </div>
                `;
                chatMessages.appendChild(typingElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Make API call through Netlify Function
                const response = await fetch(AI_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage = errorData.error || errorData.message || `API request failed with status ${response.status}`;
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                
                // Remove typing indicator
                chatMessages.removeChild(typingElement);

                // Validate response structure
                if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                    throw new Error('Invalid response format from API');
                }

                // Extract AI response
                const aiResponse = data.choices[0].message.content;

                // Add AI response to conversation history
                conversationHistory.push({
                    role: "assistant",
                    content: aiResponse
                });

                // Display AI response with markdown rendering
                const messageElement = document.createElement('div');
                messageElement.className = 'message received';
                
                await loadMarked();
                marked.setOptions({
                    breaks: true,
                    gfm: true
                });
                const renderedResponse = marked.parse(aiResponse);

                messageElement.innerHTML = `
                    <div class="message-content">
                        <div class="markdown-content">${renderedResponse}</div>
                        <span class="message-time">${getCurrentTime()}</span>
                    </div>
                `;
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;

            } catch (error) {
                console.error('AI API Error:', error);
                
                // Remove typing indicator if it exists
                const typingElement = document.querySelector('.typing');
                if (typingElement && typingElement.parentNode) {
                    chatMessages.removeChild(typingElement);
                }

                // Create user-friendly error message
                let errorMessage = error.message || 'Unknown error occurred';
                if (errorMessage.includes('API key')) {
                    errorMessage = "Configuration error. Please contact the website administrator.";
                } else if (errorMessage.includes('Invalid response')) {
                    errorMessage = "Received an unexpected response format. Please try again.";
                }

                // Fallback response with error details
                const fallbackResponse = `I apologize, but I'm having trouble connecting to my AI system right now (${errorMessage}). You can reach me directly at ${rashidProfile.contact.email} or call me at ${rashidProfile.contact.phone}. I'll get back to you as soon as possible!`;
                
                const messageElement = document.createElement('div');
                messageElement.className = 'message received error';
                messageElement.innerHTML = `
                    <div class="message-content">
                        <p>${fallbackResponse}</p>
                        <span class="message-time">${getCurrentTime()}</span>
                    </div>
                `;
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Remove error message from conversation history to avoid confusion
                if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === 'user') {
                    conversationHistory.pop();
                }
            }
        }

        // Get current time
        function getCurrentTime() {
            const now = new Date();
            return now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        }

        // Send message on button click
        sendMessage.addEventListener('click', async function() {
            const message = messageInput.value.trim();
            if (message) {
                sendUserMessage(message);
                messageInput.value = '';
                await getAIResponse(message);
            }
        });

        // Send message on Enter key
        messageInput.addEventListener('keypress', async function(e) {
            if (e.key === 'Enter') {
                const message = messageInput.value.trim();
                if (message) {
                    sendUserMessage(message);
                    messageInput.value = '';
                    await getAIResponse(message);
                }
            }
        });

        // Close modal when clicking outside
        document.addEventListener('click', function(e) {
            if (!chatModal.contains(e.target) && !chatIcon.contains(e.target)) {
                if (chatModal.classList.contains('active')) {
                    chatModal.classList.remove('active');
                    chatModal.classList.remove('minimized');
                    isMinimized = false;
                }
            }
        });

        // Handle window resize for responsive modal
        window.addEventListener('resize', function() {
            if (chatModal.classList.contains('active') && !isMinimized) {
                updateModalPosition();
            }
        });

        // Show notification after 3 seconds
        setTimeout(() => {
            if (chatNotification) {
                chatNotification.style.display = 'flex';
            }
        }, 3000);

    })();

})(jQuery);
