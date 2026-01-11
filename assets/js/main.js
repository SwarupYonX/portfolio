/**
 * PORTFOLIO MAIN JAVASCRIPT
 * Simple, clean, easy to understand
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {

  // ===== MOBILE MENU TOGGLE =====
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');

      // Animate hamburger icon
      const spans = menuToggle.querySelectorAll('span');
      if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking nav links
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // ===== SMOOTH SCROLLING =====
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        e.preventDefault();

        // Get navbar height for offset
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;

        // Calculate position
        const targetPosition = targetSection.offsetTop - navbarHeight;

        // Smooth scroll
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  });

  // ===== ACTIVE SECTION HIGHLIGHTING =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  function highlightNavigation() {
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavigation);

  // ===== FORM HANDLING =====
  // Initialize EmailJS (replace with your actual keys from emailjs.com)
  emailjs.init('39v13_f3Z9SQIT1Pf'); // Get this from EmailJS dashboard

  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Send email using EmailJS
      console.log('Attempting to send email with data:', data);
      emailjs.send('service_5hjs7h9', 'template_y1pg2tv', {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
        to_email: 'swaruptechranjan@gmail.com'
      }).then(function (response) {
        console.log('Email sent successfully:', response);
        alert('Message sent successfully! I\'ll get back to you soon.');
        contactForm.reset();
      }, function (error) {
        console.error('EmailJS error details:', error);
        console.error('Error status:', error.status);
        console.error('Error text:', error.text);
        alert('Failed to send message. Please check the browser console (F12) for error details, or contact me directly at swaruptechranjan@gmail.com');
      });
    });
  }

  // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
  // Add fade-in effect to elements as they enter viewport
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe project cards and skill categories
  const animatedElements = document.querySelectorAll('.project-card, .skill-category');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // ===== PROJECT MODAL =====
  const projectData = {
    'azure-terraform': {
      title: 'Azure Terraform Modules',
      image: 'assets/img/project-azure-terraform.png',
      tags: ['Azure', 'Terraform', 'IaC', 'DevOps'],
      description: 'A comprehensive library of reusable Terraform modules designed for rapid and consistent Azure resource deployment. These production-ready modules encapsulate best practices for networking, compute, storage, and security services, enabling teams to deploy infrastructure quickly while maintaining compliance and governance standards.',
      highlights: [
        'Reduced deployment time by 70% with pre-built, tested module templates',
        'Implemented standardized naming conventions and tagging strategies across all modules',
        'Built modular architecture supporting AKS, App Services, Azure SQL, and VNet configurations',
        'Integrated Azure Policy compliance checks into module outputs',
        'Created comprehensive documentation with usage examples for each module'
      ],
      techStack: ['Terraform', 'Azure', 'Azure DevOps', 'GitHub Actions', 'Terratest', 'Azure CLI', 'HCL'],
      liveUrl: '#',
      githubUrl: 'https://github.com/SwarupYonX/azure-terraform-modules'
    },
    'cicd-pipeline': {
      title: 'Zero-Downtime CI/CD Pipeline',
      image: 'assets/img/project-cicd-pipeline.png',
      tags: ['Github Actions', 'Docker', 'Azure DevOps', 'Kubernetes', 'Helm'],
      description: 'Automated deployment pipeline with blue-green deployments, automated testing, and rollback mechanisms. This system ensures zero-downtime releases while maintaining high code quality through comprehensive testing stages.',
      highlights: [
        'Achieved 99.9% uptime during deployments using blue-green strategy',
        'Increased deployment frequency from weekly to 50+ deployments per day',
        'Reduced deployment time from 2 hours to 15 minutes',
        'Implemented automated rollback reducing incident recovery time by 80%',
        'Built comprehensive test suite with 95% code coverage requirement'
      ],
      techStack: ['Github Actions', 'Docker', 'Azure DevOps', 'Kubernetes', 'Helm', 'SonarQube', 'Trivy', 'Selenium'],
      liveUrl: '#',
      githubUrl: 'https://github.com/SwarupYonX/cicd-pipeline'
    },
    'devops-agent': {
      title: 'Intelligent DevOps Agent',
      image: 'assets/img/project-devops-agent.png',
      tags: ['LangChain', 'OpenAI', 'Python', 'RAG', 'FastAPI'],
      description: 'Agentic AI system that automates infrastructure monitoring, incident response, and root cause analysis. Uses RAG and autonomous decision-making to handle complex operational scenarios with minimal human intervention.',
      highlights: [
        'Reduced Mean Time to Resolution (MTTR) by 60% through automated incident response',
        'Automated 80% of routine operations tasks including log analysis and alerting',
        'Built RAG system indexing 10,000+ runbooks and documentation pages',
        'Implemented autonomous scaling decisions based on predictive analytics',
        'Created natural language interface for infrastructure queries'
      ],
      techStack: ['Python', 'LangChain', 'OpenAI GPT-4', 'Pinecone', 'FastAPI', 'Redis', 'PostgreSQL', 'Grafana'],
      liveUrl: '#',
      githubUrl: 'https://github.com/SwarupYonX/devops-agent'
    },
    'observability': {
      title: 'Cloud Observability Platform',
      image: 'assets/img/project-observability.png',
      tags: ['Prometheus', 'Grafana', 'ELK Stack', 'Jaeger', 'OpenTelemetry'],
      description: 'Comprehensive monitoring and observability solution with distributed tracing, log aggregation, and predictive alerting. Provides real-time insights across microservices architecture with custom SLO dashboards and intelligent anomaly detection.',
      highlights: [
        'Processing 500K+ metrics per second across 200+ microservices',
        'Reduced alert noise by 70% using intelligent alert correlation',
        'Built custom SLO dashboards achieving 99.95% accuracy in error budget tracking',
        'Implemented distributed tracing reducing debugging time by 50%',
        'Created predictive alerting preventing 40% of potential incidents'
      ],
      techStack: ['Prometheus', 'Grafana', 'Elasticsearch', 'Logstash', 'Kibana', 'Jaeger', 'OpenTelemetry'],
      liveUrl: '#',
      githubUrl: 'https://github.com/SwarupYonX/observability-platform'
    },
    'azure-validation': {
      title: 'Azure Infrastructure Validation',
      image: 'assets/img/project-azure-validation.png',
      tags: ['PowerShell', 'Pester', 'Azure', 'DevOps', 'Automation'],
      description: 'Automated infrastructure testing framework using PowerShell Pester to validate Azure resource configurations post-deployment. This solution ensures deployed resources match expected configurations, security policies, and compliance requirements — reducing manual validation time by 98%, from days to just minutes.',
      highlights: [
        'Reduced infrastructure validation time by 98% — from days to minutes',
        'Automated validation of 200+ Azure resource configuration properties',
        'Built reusable Pester test suites for VMs, Storage, Networking, and RBAC',
        'Integrated with Azure DevOps pipelines for continuous compliance checks',
        'Implemented detailed HTML reporting for audit and compliance documentation',
        'Created parameterized tests supporting multiple environments (Dev, UAT, Prod)'
      ],
      techStack: ['PowerShell', 'Pester', 'Azure', 'Azure DevOps', 'Azure CLI', 'Az PowerShell Module', 'Terraform', 'ARM/Bicep'],
      liveUrl: '#',
      githubUrl: 'https://github.com/SwarupYonX/azure-infra-validation'
    },
    'azure-advisor-ai': {
      title: 'AI-Powered Azure Advisor Remediation',
      image: 'assets/img/project-azure-advisor.png',
      tags: ['Azure Advisor', 'LLM', 'Python', 'AI', 'Automation'],
      description: 'Intelligent recommendation engine that fetches Azure Advisor recommendations and leverages Large Language Models to analyze, prioritize, and categorize them. The system identifies which recommendations to act on immediately, which to defer, and which to ignore based on business context — while automatically generating detailed remediation steps and scripts.',
      highlights: [
        'Integrated with Azure Advisor API to fetch real-time recommendations across Cost, Security, Reliability, and Performance',
        'Built LLM-powered prioritization engine that scores recommendations based on business impact and effort',
        'Auto-generates remediation scripts (PowerShell/Azure CLI/Terraform) for approved recommendations',
        'Reduced recommendation triage time by 85% with intelligent categorization',
        'Implemented risk assessment scoring to identify which recommendations to ignore safely',
        'Created interactive dashboard showing recommendation trends and remediation progress'
      ],
      techStack: ['Python', 'Azure Advisor API', 'OpenAI GPT-4', 'Azure AI Foundry', 'FastAPI', 'Azure Functions', 'Power BI', 'Azure SDK'],
      liveUrl: '#',
      githubUrl: 'https://github.com/SwarupYonX/azure-advisor-ai'
    }
  };

  const modal = document.getElementById('projectModal');
  const modalOverlay = modal.querySelector('.modal-overlay');
  const modalClose = modal.querySelector('.modal-close');
  const projectCards = document.querySelectorAll('.project-card[data-project]');

  function openModal(projectId) {
    const project = projectData[projectId];
    if (!project) return;

    // Populate modal content
    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').textContent = project.description;

    // Tags
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = project.tags.map(tag =>
      `<span class="tag">${tag}</span>`
    ).join('');

    // Highlights
    const highlightsContainer = document.getElementById('modalHighlights');
    highlightsContainer.innerHTML = project.highlights.map(item =>
      `<li>${item}</li>`
    ).join('');

    // Tech Stack
    const techStackContainer = document.getElementById('modalTechStack');
    techStackContainer.innerHTML = project.techStack.map(tech =>
      `<span class="tech-item">${tech}</span>`
    ).join('');

    // Links
    document.getElementById('modalLiveLink').href = project.liveUrl;
    document.getElementById('modalGithubLink').href = project.githubUrl;

    // Show modal
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // Event Listeners
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.project;
      openModal(projectId);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ===== TYPING EFFECT (Optional Enhancement) =====
  // Uncomment to enable typing effect on hero title
  /*
  const heroTitle = document.querySelector('.hero-title');
  const text = heroTitle.textContent;
  heroTitle.textContent = '';
  let i = 0;
  
  function typeWriter() {
    if (i < text.length) {
      heroTitle.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }
  
  typeWriter();
  */

  // ===== CURSOR FOLLOWER (Optional Enhancement) =====
  // Uncomment to enable custom cursor follower
  /*
  const cursor = document.createElement('div');
  cursor.className = 'cursor-follower';
  document.body.appendChild(cursor);
  
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  */

  // ===== FETCH LINKEDIN POSTS =====
  async function fetchLinkedInPosts() {
    const container = document.getElementById('linkedin-posts');

    // Skip if container doesn't exist (section is commented out)
    if (!container) {
      console.log('LinkedIn posts section is disabled');
      return;
    }

    try {
      // Fetch from serverless function
      const response = await fetch('/.netlify/functions/linkedin-posts');

      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn posts');
      }

      const posts = await response.json();

      // If API returns empty or error, show demo posts
      if (!posts || posts.length === 0) {
        // Fallback demo posts
        const demoPosts = [
          {
            id: 1,
            author: 'Swarup Das',
            authorTitle: 'Cloud & AI Engineer',
            avatar: 'https://picsum.photos/48/48?random=10',
            date: '2 days ago',
            content: 'Just deployed a multi-region Kubernetes cluster with automated failover! Reduced deployment time by 60% using GitOps and ArgoCD. The future of infrastructure is declarative. 🚀 #DevOps #Kubernetes #CloudNative',
            likes: 142,
            comments: 23,
            shares: 15,
            url: 'https://linkedin.com/post/example1'
          },
          {
            id: 2,
            author: 'Swarup Das',
            authorTitle: 'Cloud & AI Engineer',
            avatar: 'https://picsum.photos/48/48?random=11',
            date: '5 days ago',
            content: 'Building agentic AI systems that can autonomously troubleshoot infrastructure issues. Our latest agent reduced MTTR by 60%. The combination of LLMs + DevOps is incredibly powerful. #AI #AgenticAI #Infrastructure',
            likes: 203,
            comments: 34,
            shares: 28,
            url: 'https://linkedin.com/post/example2'
          },
          {
            id: 3,
            author: 'Swarup Das',
            authorTitle: 'Cloud & AI Engineer',
            avatar: 'https://picsum.photos/48/48?random=12',
            date: '1 week ago',
            content: 'New blog post: "Optimizing Cloud Costs with Intelligent Scheduling". Saved 40% on compute costs using smart auto-scaling strategies. Link in comments! 💰 #AWS #CostOptimization #CloudComputing',
            likes: 178,
            comments: 41,
            shares: 32,
            url: 'https://linkedin.com/post/example3'
          }
        ];
        renderPosts(container, demoPosts, 'linkedin');
      } else {
        renderPosts(container, posts, 'linkedin');
      }

    } catch (error) {
      console.error('Error fetching LinkedIn posts:', error);
      showError(container, 'Unable to load LinkedIn posts. Please try again later.');
    }
  }

  // ===== FETCH TWITTER POSTS =====
  async function fetchTwitterPosts() {
    const container = document.getElementById('twitter-posts');

    // Skip if container doesn't exist (section is commented out)
    if (!container) {
      console.log('Twitter posts section is disabled');
      return;
    }

    try {
      // Fetch from serverless function (works on Netlify, Vercel, etc.)
      const response = await fetch('/.netlify/functions/twitter-posts');

      if (!response.ok) {
        throw new Error('Failed to fetch Twitter posts');
      }

      const posts = await response.json();

      // If API returns empty or error, show demo posts
      if (!posts || posts.length === 0) {
        // Fallback demo posts
        const demoPosts = [
          {
            id: 1,
            author: 'Swarup Das',
            authorTitle: '@swarup_dev',
            avatar: 'https://picsum.photos/48/48?random=20',
            date: '3 hours ago',
            content: 'Terraform tip: Always use remote state with state locking. Just saved a team from a merge conflict disaster. Prevention > cure. 🛡️',
            likes: 89,
            comments: 12,
            shares: 24,
            url: 'https://twitter.com/example/status/1'
          },
          {
            id: 2,
            author: 'Swarup Das',
            authorTitle: '@swarup_dev',
            avatar: 'https://picsum.photos/48/48?random=21',
            date: '1 day ago',
            content: 'The best DevOps metric isn\'t deployment frequency or MTTR. It\'s team happiness. Happy engineers build better systems. Period. 😊',
            likes: 234,
            comments: 45,
            shares: 67,
            url: 'https://twitter.com/example/status/2'
          },
          {
            id: 3,
            author: 'Swarup Das',
            authorTitle: '@swarup_dev',
            avatar: 'https://picsum.photos/48/48?random=22',
            date: '2 days ago',
            content: 'Just tested GPT-4\'s ability to generate Terraform modules. Mind blown 🤯 We\'re entering a new era where AI assists in infrastructure coding. The productivity gains are real.',
            likes: 312,
            comments: 58,
            shares: 89,
            url: 'https://twitter.com/example/status/3'
          }
        ];
        renderPosts(container, demoPosts, 'twitter');
      } else {
        renderPosts(container, posts, 'twitter');
      }

    } catch (error) {
      console.error('Error fetching Twitter posts:', error);
      showError(container, 'Unable to load Twitter posts. Please try again later.');
    }
  }

  // ===== RENDER POSTS =====
  function renderPosts(container, posts, platform) {
    if (!container) return; // Safety check

    if (!posts || posts.length === 0) {
      showEmptyState(container);
      return;
    }

    container.innerHTML = posts.map(post => `
      <article class="post-card">
        <div class="post-header">
          <img src="${post.avatar}" alt="${post.author}" class="post-avatar">
          <div class="post-author-info">
            <div class="post-author-name">${post.author}</div>
            <div class="post-date">${post.date}</div>
          </div>
        </div>
        
        <div class="post-content">
          ${post.content}
        </div>
        
        ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
        
        <div class="post-stats">
          <span class="post-stat likes">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            ${post.likes}
          </span>
          <span class="post-stat comments">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            ${post.comments}
          </span>
          <span class="post-stat shares">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
            ${post.shares}
          </span>
        </div>
        
        <a href="${post.url}" target="_blank" class="post-link">View on ${platform === 'linkedin' ? 'LinkedIn' : 'Twitter'} →</a>
      </article>
    `).join('');
  }

  // ===== ERROR STATE =====
  function showError(container, message) {
    if (!container) return; // Safety check

    container.innerHTML = `
      <div class="error-message">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3>Oops!</h3>
        <p>${message}</p>
      </div>
    `;
  }

  // ===== EMPTY STATE =====
  function showEmptyState(container) {
    if (!container) return; // Safety check

    container.innerHTML = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        <p>No posts available at the moment.</p>
      </div>
    `;
  }

  // ===== INITIALIZE SOCIAL FEEDS =====
  // Load posts when page loads
  fetchLinkedInPosts();
  fetchTwitterPosts();

  console.log('✨ Portfolio loaded successfully!');
});
