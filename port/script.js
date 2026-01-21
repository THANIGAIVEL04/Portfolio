// ===========================
// 3D Background - Cybersecurity Network Theme (Full Screen)
// ===========================
let scene, camera, renderer, networkGlobe, particles, connections = [], nodes = [], allObjects = [];
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;


function init3DBackground() {
    const canvas = document.getElementById('bg-canvas');

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 25;

    // Create LARGE network globe (main centerpiece) - fills more screen
    const globeGeometry = new THREE.SphereGeometry(20, 32, 32);
    const globeMaterial = new THREE.MeshPhongMaterial({
        color: 0x9d4edd,
        wireframe: true,
        transparent: true,
        opacity: 0.25
    });
    networkGlobe = new THREE.Mesh(globeGeometry, globeMaterial);
    networkGlobe.position.set(0, 0, -10);
    scene.add(networkGlobe);
    allObjects.push(networkGlobe);

    // Add network nodes on the globe surface
    const nodeCount = 50;
    const nodeMaterial = new THREE.MeshPhongMaterial({
        color: 0x9d4edd,
        emissive: 0x9d4edd,
        emissiveIntensity: 0.6
    });

    for (let i = 0; i < nodeCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / nodeCount);
        const theta = Math.sqrt(nodeCount * Math.PI) * phi;

        const x = 20 * Math.cos(theta) * Math.sin(phi);
        const y = 20 * Math.sin(theta) * Math.sin(phi);
        const z = 20 * Math.cos(phi);

        const nodeGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
        node.position.set(x, y, z);
        nodes.push(node);
        networkGlobe.add(node);
    }

    // Create connections between nodes
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x9d4edd,
        transparent: true,
        opacity: 0.15
    });

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (Math.random() > 0.88) {
                const points = [];
                points.push(nodes[i].position.clone());
                points.push(nodes[j].position.clone());
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, lineMaterial);
                connections.push(line);
                networkGlobe.add(line);
            }
        }
    }

    // Add smaller network globes around the screen edges
    const smallGlobePositions = [
        { x: -30, y: 20, z: -20 },
        { x: 30, y: -20, z: -25 },
        { x: -25, y: -25, z: -15 },
        { x: 35, y: 25, z: -30 }
    ];

    smallGlobePositions.forEach((pos, index) => {
        const smallGlobe = new THREE.Mesh(
            new THREE.SphereGeometry(8, 16, 16),
            new THREE.MeshPhongMaterial({
                color: 0x9d4edd,
                wireframe: true,
                transparent: true,
                opacity: 0.2
            })
        );
        smallGlobe.position.set(pos.x, pos.y, pos.z);
        smallGlobe.userData = { rotationSpeed: { x: 0.001, y: 0.002 } };
        scene.add(smallGlobe);
        allObjects.push(smallGlobe);
    });

    // Add floating security shields distributed across screen
    const shieldCount = 15;
    for (let i = 0; i < shieldCount; i++) {
        const angle = (i / shieldCount) * Math.PI * 2;
        const radius = 30 + Math.random() * 15;
        const height = (Math.random() - 0.5) * 40;

        const shieldGeometry = new THREE.OctahedronGeometry(2, 0);
        const shieldMaterial = new THREE.MeshPhongMaterial({
            color: 0x9d4edd,
            wireframe: true,
            transparent: true,
            opacity: 0.35
        });
        const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
        shield.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius - 15
        );
        shield.userData = {
            angle: angle,
            radius: radius,
            height: height,
            speed: 0.0008 + Math.random() * 0.0015
        };
        allObjects.push(shield);
        scene.add(shield);
    }

    // Add hexagonal grid elements around the edges
    for (let i = 0; i < 20; i++) {
        const hexGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 6);
        const hexMaterial = new THREE.MeshPhongMaterial({
            color: 0x9d4edd,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        const hex = new THREE.Mesh(hexGeometry, hexMaterial);
        hex.position.set(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 60,
            -30 - Math.random() * 20
        );
        hex.rotation.x = Math.PI / 2;
        hex.userData = { rotationSpeed: Math.random() * 0.01 };
        allObjects.push(hex);
        scene.add(hex);
    }

    // Create massive particle system (data packets) filling the screen
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 4000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 200;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x9d4edd,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Lighting for cybersecurity theme
    const ambientLight = new THREE.AmbientLight(0x9d4edd, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x9d4edd, 1.5);
    pointLight1.position.set(30, 30, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xbb86fc, 1);
    pointLight2.position.set(-30, -30, -20);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x9d4edd, 0.8);
    pointLight3.position.set(0, 0, 30);
    scene.add(pointLight3);

    animate3D();
}

function animate3D() {
    requestAnimationFrame(animate3D);

    // Smooth cursor-following rotation for main globe
    targetRotationY = mouseX * 0.0003;
    targetRotationX = mouseY * 0.0002;

    // Rotate the main network globe with cursor influence
    if (networkGlobe) {
        networkGlobe.rotation.y += 0.0015 + (targetRotationY - networkGlobe.rotation.y) * 0.05;
        networkGlobe.rotation.x += 0.0008 + (targetRotationX - networkGlobe.rotation.x) * 0.05;
    }

    // Subtle camera parallax based on mouse position
    camera.position.x += (mouseX * 0.002 - camera.position.x) * 0.03;
    camera.position.y += (mouseY * -0.002 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);


    // Animate all objects
    allObjects.forEach((obj, index) => {
        // Animate shields in orbit
        if (obj.userData.angle !== undefined) {
            obj.userData.angle += obj.userData.speed;
            obj.position.x = Math.cos(obj.userData.angle) * obj.userData.radius;
            obj.position.z = Math.sin(obj.userData.angle) * obj.userData.radius - 15;
            obj.rotation.y += 0.015;
            obj.rotation.x += 0.01;
        }

        // Animate small globes
        if (obj.userData.rotationSpeed) {
            obj.rotation.x += obj.userData.rotationSpeed.x || obj.userData.rotationSpeed;
            obj.rotation.y += obj.userData.rotationSpeed.y || obj.userData.rotationSpeed;
        }
    });

    // Rotate particles (data flow)
    if (particles) {
        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0001;
    }

    renderer.render(scene, camera);
}

// Mouse tracking for cursor-following 3D movement (desktop/tablet only)
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2);
        mouseY = (event.clientY - window.innerHeight / 2);
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    if (renderer && camera) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
});

// Navigation
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');

function updateActiveNav() {
    const scrollPos = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.skill-item, .project-card, .cert-item, .experience-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    init3DBackground();
    updateActiveNav();
    console.log('Portfolio loaded successfully! 🚀');
});

// Custom Particle Cursor System
// Custom Particle Cursor System
// Gradient Comet Cursor System
const cursorDot = document.querySelector('.cursor-dot');
const trailCanvas = document.getElementById('cursor-trail');

if (cursorDot && trailCanvas && window.innerWidth > 768) {
    const ctx = trailCanvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    trailCanvas.width = width;
    trailCanvas.height = height;

    // Trail storage
    let trail = [];
    let mouseX = 0, mouseY = 0;
    let isMoving = false;
    let isHovering = false;

    // Track mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update dot directly
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';

        // Add point to trail
        trail.push({
            x: mouseX,
            y: mouseY,
            age: 0,
            velocity: 1 // Baseline
        });

        isMoving = true;
    });

    // Handle resize
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        trailCanvas.width = width;
        trailCanvas.height = height;
    });

    // Hover listeners
    const clickableElements = document.querySelectorAll('a, button, .btn-primary, .btn-view-project, .icon-minimal, .skill-tag, .project-card, .contact-icon-item');

    clickableElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
            isHovering = true;
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
            isHovering = false;
        });
    });

    function animateTrail() {
        ctx.clearRect(0, 0, width, height);

        // Process trail
        if (trail.length > 0) {
            // Speed calculation for dynamic length
            // We keep points based on age. 
            // Fast movement = points spread out = naturally longer tail.
            // But user wants "Fast -> longer, Slow -> short".
            // Standard decay works: fast adds more distance between points, so visual length is longer for same 'age' duration.

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let i = 0; i < trail.length; i++) {
                const point = trail[i];

                // Increase age
                // Decay faster if not hovering? Or keep constant.
                point.age++;
            }

            // Remove old points
            // Adjust lifetime based on speed could be complex, simple fixed lifetime works well for "Physics" feel.
            // Let's use a max age of 20-30 frames.
            const maxAge = isHovering ? 35 : 25;
            trail = trail.filter(p => p.age < maxAge);

            // Draw trail as a continuous path (or segmented for gradient)
            // Segmented is needed for gradient along the path

            if (trail.length > 1) {
                for (let i = 0; i < trail.length - 1; i++) {
                    const p1 = trail[i];
                    const p2 = trail[i + 1];

                    // Calculate opacity based on age (Newer = 1, Older = 0)
                    // p1 is older (pushed earlier) ?? No, push adds to end.
                    // Wait, array push adds to end. So index 0 is OLDEST.
                    // Index length-1 is NEWEST (current mouse).

                    // Normalized age: 0 (new) to 1 (old)
                    // Actually let's use index.
                    // p2 is closer to mouse (newer).

                    const ratio = i / trail.length; // 0 (tail tip) to 1 (head)

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);

                    // Gradient colors logic
                    // Start (Head): #a020f0
                    // End (Tail): #421266 / Transparent

                    // Width logic: Head wide, Tail narrow
                    const baseWidth = isHovering ? 8 : 5;
                    const lineWidth = baseWidth * ratio; // Taper to 0 at tail
                    ctx.lineWidth = lineWidth < 0.5 ? 0.5 : lineWidth;

                    // Color logic
                    // We want bright neon at head, dark purple at tail
                    // RGB: 
                    // Head: 160, 32, 240 (a020f0)
                    // Tail: 66, 18, 102 (421266)

                    // Simple opacity fade is usually enough for "Comet" look
                    const opacity = ratio * 0.8; // Max 0.8 opacity

                    // Dynamic color mix
                    // Let's stick to base purple with fading opacity for performance and cleanliness
                    ctx.strokeStyle = `rgba(160, 32, 240, ${opacity})`;

                    // Add a slight blur effect for "Neon" feel?
                    // Canvas shadow is expensive. Stick to solid strokes with transparency.

                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateTrail);
    }
    animateTrail();
}
