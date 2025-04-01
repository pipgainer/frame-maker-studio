"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    Mail,
    ArrowUpRight,
    Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NextSeo } from 'next-seo';

// Video file paths from the public folder
const videoFilePaths = [
    '/videos/car.mp4',
    '/videos/compositing_showreel.mp4',
    '/videos/eye_hole_cg.mov',
    '/videos/face_touchup.mp4',
    '/videos/reel.mp4',
    '/videos/srk_zero.mp4',
];

// Dummy project data (replace with your actual project data)
interface Project {
    title: string;
    description: string;
    videoUrl: string;
    detailsUrl: string;
    index: number;
    featured?: boolean;
}

const dummyProjects: Project[] = [
    {
        title: 'Project 1: Sci-Fi Environment',
        description: 'Changing the car color and environment in a sci-fi setting.',
        videoUrl: videoFilePaths[0],
        detailsUrl: '#',
        index: 0,
        featured: true,
    },
    {
        title: 'Project 2: Character Animation',
        description: 'Compositing showreel showcasing character animation and effects.',
        videoUrl: videoFilePaths[1],
        detailsUrl: '#',
        index: 1,
        featured: true,
    },
    {
        title: 'Project 3: Face Eye Hole CG',
        description: 'Eye hole CG for face touchup and product visualization.',
        videoUrl: videoFilePaths[2],
        detailsUrl: '#',
        index: 2,
        featured: true,
    },
    {
        title: 'Project 4: Additional Project',
        description: 'Another project to showcase my skills.',
        videoUrl: videoFilePaths[3],
        detailsUrl: '#',
        index: 3,
        featured: true,
    },
    {
        title: 'Project 5: Reel Showcase',
        description: 'Editing video reel showcasing various projects.',
        videoUrl: videoFilePaths[4],
        detailsUrl: '#',
        index: 4,
        featured: true,
    },
    {
        title: 'Project 6: Character Animation',
        description: 'SRK Zero CG Animation',
        videoUrl: videoFilePaths[5],
        detailsUrl: '#',
        index: 5,
        featured: true,
    },
];

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: 'easeInOut'
        }
    },
};

const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: 'easeInOut' } },
};

// Reusable Video Player Component
const VideoPlayer = ({ src, title }: { src: string, title: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLIFrameElement>(null);

    const togglePlay = useCallback(() => {
        setIsPlaying((prev) => !prev);
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.contentWindow?.postMessage(
                    '{"event":"command","func":"playVideo","args":[]}',
                    '*'
                );
            } else {
                videoRef.current.contentWindow?.postMessage(
                    '{"event":"command","func":"pauseVideo","args":[]}',
                    '*'
                );
            }
        }
    }, [isPlaying]);

    return (
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group">
            <AnimatePresence>
                {!isPlaying && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md cursor-pointer"
                        onClick={togglePlay}
                        aria-label="Play Video"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Play className="w-16 h-16 text-white" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <iframe
                ref={videoRef}
                src={src}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
            />
        </div>
    );
};

// Reusable Project Card Component
const ProjectCard = ({ project }: { project: Project }) => {

    return (
        <motion.div variants={itemVariants} className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-blue-500/50 hover:scale-[1.01]">
            <div
                className="relative rounded-xl overflow-hidden"
            >
                <VideoPlayer src={project.videoUrl} title={project.title} />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <p className="text-gray-400 mt-2">{project.description}</p>
                <a
                    href={project.detailsUrl}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mt-4"
                >
                    View Details
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                </a>
            </div>
        </motion.div>
    );
};

const VFXPortfolio = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const containerRef = useRef<HTMLDivElement>(null);
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);


    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        // Filter featured projects
        const featured = dummyProjects.filter(project => project.featured);
        setFeaturedProjects(featured);
    }, []);

    // Function to handle section change on scroll
    const handleScroll = useCallback(() => {
        if (containerRef.current) {
            const sections = containerRef.current.querySelectorAll('section');
            const navLinks = document.querySelectorAll('nav a');

            // let currentSectionId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
                    // currentSectionId = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                // if (link.getAttribute('href').slice(1) === currentSectionId) {
                //     link.classList.add('active');
                // }
            });
            // setActiveSection(currentSectionId);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // Function to handle smooth scrolling
    const handleNavLinkClick = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <div ref={containerRef} className="bg-gray-900 text-white overflow-hidden">
            <NextSeo
                title="Srijan VFX Portfolio"
                description="Showcasing stunning visual effects projects by Srijan VFX. Explore our VFX artistry in films, commercials, and more."
                canonical="https://srijanvfx.com"
                openGraph={{
                    url: 'https://srijanvfx.com',
                    title: 'Srijan VFX Portfolio',
                    description: 'Explore the best VFX projects by Srijan VFX.',
                    images: [
                        {
                            url: 'https://placehold.co/1200x630/000/fff/png?text=Srijan+VFX+Portfolio',
                            width: 1200,
                            height: 630,
                            alt: 'Srijan VFX Portfolio',
                        },
                    ],
                }}
            // keywords={['Srijan VFX', 'VFX portfolio', 'visual effects', 'VFX artist', 'film VFX', 'commercial VFX', '3D animation', 'compositing', 'India VFX']}
            />
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 bg-transparent py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        The Frame Maker Studio
                    </h1>
                    <nav className="hidden md:block">
                        <ul className="flex space-x-8">
                            <li>
                                <a href="#home" onClick={() => handleNavLinkClick('home')} className={activeSection === 'home' ? "text-white active" : "text-gray-300 hover:text-white transition-colors duration-300"}>
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#about" onClick={() => handleNavLinkClick('about')} className={activeSection === 'about' ? "text-white active" : "text-gray-300 hover:text-white transition-colors duration-300"}>
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#projects" onClick={() => handleNavLinkClick('projects')} className={activeSection === 'projects' ? "text-white active" : "text-gray-300 hover:text-white transition-colors duration-300"}>
                                    Projects
                                </a>
                            </li>
                            <li>
                                <a href="#contact" onClick={() => handleNavLinkClick('contact')} className={activeSection === 'contact' ? "text-white active" : "text-gray-300 hover:text-white transition-colors duration-300"}>
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <button id="hamburger-btn" className="md:hidden text-gray-300 focus:outline-none" onClick={toggleMobileMenu} aria-label="Toggle Navigation">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </header>


            {/* Video Section */}
            <div className="relative w-full h-screen overflow-hidden">
                <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted playsInline>
                    <source src={videoFilePaths[1]} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 text-shadow-lg"
                    >
                        Hello, I'm{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Srijan
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.3 }}
                        className="text-xl sm:text-2xl text-gray-300 mb-8"
                    >
                        A VFX Artist Passionate About Creating Stunning Visual Effects at The Frame Maker Studio.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.6 }}
                    >
                        <Button
                            variant="default"
                            size="lg"
                            onClick={() => handleNavLinkClick('projects')}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full px-8 py-3 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/50"
                        >
                            See My Work
                        </Button>
                    </motion.div>
                </div>
            </div>



            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-90 z-50"
                    >
                        <div className="bg-gray-800 w-80 h-full absolute right-0 p-6">
                            <div className="flex justify-end mb-4">
                                <button
                                    id="close-menu-btn"
                                    className="text-gray-300 focus:outline-none"
                                    onClick={toggleMobileMenu}
                                    aria-label="Close Menu"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <nav className="block">
                                <ul className="space-y-4">
                                    <li>
                                        <a
                                            href="#home"
                                            onClick={() => handleNavLinkClick('home')}
                                            className="block text-lg text-gray-300 hover:text-white transition-colors duration-300"
                                        >
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#about"
                                            onClick={() => handleNavLinkClick('about')}
                                            className="block text-lg text-gray-300 hover:text-white transition-colors duration-300"
                                        >
                                            About
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#projects"
                                            onClick={() => handleNavLinkClick('projects')}
                                            className="block text-lg text-gray-300 hover:text-white transition-colors duration-300"
                                        >
                                            Projects
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#contact"
                                            onClick={() => handleNavLinkClick('contact')}
                                            className="block text-lg text-gray-300 hover:text-white transition-colors duration-300"
                                        >
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Main Content */}
            <main>

                {/* About Section */}
                <section id="about" className="bg-gray-900 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            className="text-gray-300"
                        >
                            <h3 className="text-2xl sm:text-3xl font-semibold text-blue-400 mb-4">
                                About The Frame Maker Studio
                            </h3>
                            <p className="text-lg mb-6">
                                I am a highly skilled and creative VFX artist with 5 years
                                of experience in the industry. I have a strong passion for visual
                                storytelling and a keen eye for detail. My expertise includes
                                compositing, 3D modeling, animation,
                                simulations.
                            </p>
                            <p className="text-lg">
                                I have worked on a variety of projects, including
                                films, commercials, video games, and I am always
                                eager to take on new challenges and push the boundaries of what
                                is possible with VFX at The Frame Maker Studio.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            className="rounded-xl overflow-hidden shadow-2xl border border-gray-700"
                        >
                            {/* Replace with an actual image or video of yourself */}
                            <img
                                src="https://placehold.co/600x400/000/fff/png?text=VFX+Artist"
                                alt="Your Name"
                                className="w-full h-auto"
                            />
                        </motion.div>
                    </div>
                </section>

                {/* Featured Projects Section */}
                <section id="projects" className="bg-gray-900 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <h3 className="text-3xl sm:text-4xl font-semibold text-blue-400 mb-8 text-center">
                            Featured Projects from Srijan VFX
                        </h3>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {featuredProjects.map((project) => (
                                <ProjectCard key={project.index} project={project} />
                            ))}
                        </motion.div>
                        <div className="mt-12 text-center">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => { }}
                                className="text-blue-400 hover:text-white hover:bg-blue-500/20 border-blue-500/30 transition-all duration-300"
                            >
                                View All Projects
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="bg-gray-800 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <h3 className="text-3xl sm:text-4xl font-semibold text-blue-400 mb-8 text-center">
                            Contact Srijan VFX
                        </h3>
                        <div className="bg-gray-900 rounded-xl shadow-2xl p-8 md:p-12 border border-gray-700">
                            <p className="text-lg text-gray-300 text-center mb-6">
                                I am available for freelance projects and collaborations. Feel
                                free to reach out to me via email or connect with me on social
                                media.
                            </p>
                            <div className="flex justify-center space-x-6 mb-6">
                                {/* Email Link */}
                                <a
                                    href="mailto:your.email@example.com"
                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 inline-flex items-center"
                                >
                                    <Mail className="w-6 h-6 mr-2" />
                                    Email: your.email@example.com
                                </a>
                                {/* LinkedIn Link (Replace with actual link) */}
                                <a
                                    href="https://www.linkedin.com/in/yourprofile"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 inline-flex items-center"
                                >
                                    {/* <Linkedin className="w-6 h-6 mr-2" /> */}
                                    LinkedIn
                                </a>
                            </div>
                            <div className="text-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => { }}
                                    className="text-blue-400 hover:text-white hover:bg-blue-500/20 border-blue-500/30 transition-all duration-300"
                                >
                                    Get a Quote
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center text-gray-400">
                    © {new Date().getFullYear()} Srijan VFX. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default VFXPortfolio;
