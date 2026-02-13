/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti';

// Reasons for the slideshow
const reasons = [
    "Your smile lights up my world ✨",
    "You make every day special 🌟",
    "Your laugh is my favorite sound 😊",
    "You understand me like no one else 💫",
    "Every moment with you is magical 🎭",
    "You make me a better person 🌱",
    "Your kindness inspires me daily 🌈",
    "You're my best friend and soulmate 💕",
    "Your presence brings me peace 🕊️",
    "I fall for you more every day 💖"
];

const Invitation = () => {
    const [noButtonSize, setNoButtonSize] = useState(1);
    const [yesButtonSize, setYesButtonSize] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
    const [hearts, setHearts] = useState([]);
    
    // Heart-catching game state
    const [gameActive, setGameActive] = useState(true);
    const [gameScore, setGameScore] = useState(0);
    const [fallingHearts, setFallingHearts] = useState([]);
    const [gameCompleted, setGameCompleted] = useState(false);
    
    // Slideshow state
    const [showSlideshow, setShowSlideshow] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Countdown timer state
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    
    // Ref for unique heart IDs
    const heartIdCounter = useRef(0);
    
    // Generate floating hearts on mount
    useEffect(() => {
        const heartArray = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            animationDelay: Math.random() * 5,
            size: Math.random() * 20 + 15,
            duration: Math.random() * 10 + 15
        }));
        setHearts(heartArray);
    }, []);
    
    // Heart-catching game: Generate falling hearts FAST
    useEffect(() => {
        if (gameActive && !gameCompleted) {
            const interval = setInterval(() => {
                // Sometimes spawn 2 hearts at once for more density
                const spawnCount = Math.random() > 0.7 ? 2 : 1;
                
                const newHearts = [];
                for (let i = 0; i < spawnCount; i++) {
                    newHearts.push({
                        id: `heart-${heartIdCounter.current++}`,
                        left: Math.random() * 90 + 5,
                        speed: Math.random() * 2 + 3, // Faster fall speed: 3-5 seconds
                        size: Math.random() * 25 + 35 // Slightly bigger hearts: 35-60px
                    });
                }
                setFallingHearts(prev => [...prev, ...newHearts]);
            }, 80); // MUCH faster: new heart every 80ms (was 100ms)
            
            return () => clearInterval(interval);
        }
    }, [gameActive, gameCompleted]);
    
    // Remove hearts that fall off screen
    useEffect(() => {
        if (gameActive && !gameCompleted) {
            const interval = setInterval(() => {
                setFallingHearts(prev => 
                    prev.filter(heart => {
                        const element = document.getElementById(`falling-heart-${heart.id}`);
                        if (element) {
                            const rect = element.getBoundingClientRect();
                            return rect.top < window.innerHeight;
                        }
                        return false;
                    })
                );
            }, 100);
            
            return () => clearInterval(interval);
        }
    }, [gameActive, gameCompleted]);
    
    // Check if game is completed
    useEffect(() => {
        if (gameScore >= 10 && !gameCompleted) {
            setGameCompleted(true);
            setTimeout(() => {
                setGameActive(false);
            }, 500);
        }
    }, [gameScore, gameCompleted]);
    
    // Countdown timer effect
    useEffect(() => {
        const calculateCountdown = () => {
            const targetDate = new Date('2026-02-14T19:00:00');
            const now = new Date();
            const difference = targetDate - now;
            
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                
                setCountdown({ days, hours, minutes, seconds });
            }
        };
        
        calculateCountdown();
        const interval = setInterval(calculateCountdown, 1000);
        
        return () => clearInterval(interval);
    }, []);
    
    // Slideshow auto-play
    useEffect(() => {
        if (showSlideshow) {
            const interval = setInterval(() => {
                setCurrentSlide(prev => (prev + 1) % reasons.length);
            }, 3000);
            
            return () => clearInterval(interval);
        }
    }, [showSlideshow]);

    const handleClickYes = () => {
        setIsEnvelopeOpen(true);
        setTimeout(() => {
            setShowSlideshow(true);
            setTimeout(() => {
                setShowModal(true);
                // Heart burst confetti
                const count = 200;
                const defaults = {
                    origin: { y: 0.7 },
                    shapes: ['circle'],
                    colors: ['#ff0844', '#ffb199', '#ffffff', '#ffd700']
                };

                function fire(particleRatio, opts) {
                    confetti({
                        ...defaults,
                        ...opts,
                        particleCount: Math.floor(count * particleRatio)
                    });
                }

                fire(0.25, { spread: 26, startVelocity: 55 });
                fire(0.2, { spread: 60 });
                fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
                fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
                fire(0.1, { spread: 120, startVelocity: 45 });
            }, 2000);
        }, 600);
    };

    const handleClickNo = () => {
        if (noButtonSize > 0.3) {
            setNoButtonSize(prev => prev * 0.8);
            setYesButtonSize(prev => prev * 1.15);
        }
    };
    
    const catchHeart = (heartId) => {
        setFallingHearts(prev => prev.filter(h => h.id !== heartId));
        setGameScore(prev => prev + 1);
    };
    
    const skipGame = () => {
        setGameActive(false);
        setGameCompleted(true);
        setGameScore(10);
    };
    
    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % reasons.length);
    };
    
    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + reasons.length) % reasons.length);
    };

    return (
        <div className='relative w-full min-h-screen flex items-center justify-center p-6 overflow-hidden bg-linear-to-br from-rose-900 via-pink-800 to-red-900'>
            {/* Heart-Catching Game Overlay */}
            {gameActive && (
                <div className='fixed inset-0 z-50 bg-linear-to-br from-rose-900 via-pink-800 to-red-900 flex flex-col items-center justify-center'>
                    {/* Game Instructions and Score */}
                    <div className='text-center mb-8 z-10'>
                        <h2 className='font-aegean text-4xl md:text-6xl text-white mb-4 animate-pulse'>
                            Catch the Hearts! 💝
                        </h2>
                        <p className='text-2xl md:text-3xl text-pink-200 font-bold mb-2'>
                            ❤️ {gameScore}/10
                        </p>
                        <p className='text-lg md:text-xl text-pink-300'>
                            Click the falling hearts to unlock your invitation!
                        </p>
                    </div>
                    
                    {/* Falling Hearts Container */}
                    <div className='absolute inset-0 overflow-hidden'>
                        {fallingHearts.map(heart => (
                            <div
                                key={heart.id}
                                id={`falling-heart-${heart.id}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    catchHeart(heart.id);
                                }}
                                onTouchStart={(e) => {
                                    e.stopPropagation();
                                    catchHeart(heart.id);
                                }}
                                className='absolute cursor-pointer active:scale-150 active:opacity-50 transition-transform animate-fall-heart select-none'
                                style={{
                                    left: `${heart.left}%`,
                                    fontSize: `${heart.size}px`,
                                    animation: `fall-heart ${heart.speed}s linear forwards`,
                                    top: '-50px',
                                    zIndex: 10,
                                    pointerEvents: 'auto'
                                }}
                            >
                                ❤️
                            </div>
                        ))}
                    </div>
                    
                    {/* Skip Button */}
                    <button
                        onClick={skipGame}
                        className='fixed bottom-8 right-8 z-20 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-all duration-300 text-sm'
                    >
                        Skip Game →
                    </button>
                    
                    {/* Game completion animation */}
                    {gameCompleted && (
                        <div className='fixed inset-0 flex items-center justify-center z-30 bg-black/50 backdrop-blur-sm animate-fadeIn'>
                            <div className='text-center animate-scaleIn'>
                                <div className='text-9xl mb-4 animate-heartbeat'>💖</div>
                                <p className='text-4xl text-white font-bold'>You did it!</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* Animated gradient overlay */}
            <div className='absolute inset-0 bg-linear-to-br from-pink-500/20 via-transparent to-red-500/20 animate-pulse-slow' />
            
            {/* Floating hearts background */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                {hearts.map(heart => (
                    <div
                        key={heart.id}
                        className='absolute text-pink-300/30 animate-float'
                        style={{
                            left: `${heart.left}%`,
                            fontSize: `${heart.size}px`,
                            animationDelay: `${heart.animationDelay}s`,
                            animationDuration: `${heart.duration}s`,
                            bottom: '-50px'
                        }}
                    >
                        ♥
                    </div>
                ))}
            </div>

            {/* Main card - Envelope style */}
            <div className={`relative z-10 transition-all duration-700 ${isEnvelopeOpen ? 'scale-110 rotate-2' : 'scale-100'}`}>
                <div className='bg-linear-to-br from-rose-100 to-pink-50 p-10 md:p-16 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border-4 border-red-300/50 max-w-2xl w-full relative overflow-hidden'>
                    
                    {/* Decorative corner hearts */}
                    <div className='absolute top-4 left-4 text-4xl text-red-400 animate-pulse'>❤️</div>
                    <div className='absolute top-4 right-4 text-4xl text-red-400 animate-pulse' style={{ animationDelay: '0.5s' }}>❤️</div>
                    <div className='absolute bottom-4 left-4 text-4xl text-red-400 animate-pulse' style={{ animationDelay: '1s' }}>❤️</div>
                    <div className='absolute bottom-4 right-4 text-4xl text-red-400 animate-pulse' style={{ animationDelay: '1.5s' }}>❤️</div>
                    
                    {/* Content */}
                    <div className='relative z-10'>
                        <div className='text-center mb-8'>
                            <div className='text-7xl md:text-9xl mb-6 animate-bounce-slow'>💌</div>
                            <h1 className='font-aegean text-5xl md:text-7xl text-transparent bg-clip-text bg-linear-to-r from-red-600 via-pink-500 to-red-600 mb-4 leading-tight'>
                                Be My Valentine?
                            </h1>
                            <p className='text-rose-800 text-lg md:text-xl font-light italic'>
                                "My heart beats only for you..."
                            </p>
                        </div>

                        <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-6 border-2 border-red-200'>
                            <p className='text-rose-900 text-center text-sm md:text-base font-medium tracking-wide'>
                                📅 February 14, 2026 • 8:00 AM
                            </p>
                        </div>
                        
                        {/* Countdown Timer */}
                        <div className='bg-linear-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 mb-10 border-2 border-red-300'>
                            <p className='text-rose-900 text-center text-xs md:text-sm font-semibold mb-3 uppercase tracking-wider'>
                                ⏰ Time Until Our Date
                            </p>
                            <div className='flex justify-center gap-2 md:gap-4'>
                                <div className='flex flex-col items-center'>
                                    <div className='bg-white/80 rounded-xl px-3 py-2 md:px-4 md:py-3 shadow-lg min-w-15 countdown-flip'>
                                        <span className='text-2xl md:text-4xl font-bold text-red-600'>{countdown.days}</span>
                                    </div>
                                    <span className='text-xs md:text-sm text-rose-800 mt-1 font-medium'>Days</span>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <div className='bg-white/80 rounded-xl px-3 py-2 md:px-4 md:py-3 shadow-lg min-w-15 countdown-flip'>
                                        <span className='text-2xl md:text-4xl font-bold text-pink-600'>{countdown.hours}</span>
                                    </div>
                                    <span className='text-xs md:text-sm text-rose-800 mt-1 font-medium'>Hours</span>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <div className='bg-white/80 rounded-xl px-3 py-2 md:px-4 md:py-3 shadow-lg min-w-15 countdown-flip'>
                                        <span className='text-2xl md:text-4xl font-bold text-red-500'>{countdown.minutes}</span>
                                    </div>
                                    <span className='text-xs md:text-sm text-rose-800 mt-1 font-medium'>Mins</span>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <div className='bg-white/80 rounded-xl px-3 py-2 md:px-4 md:py-3 shadow-lg min-w-15 countdown-flip'>
                                        <span className='text-2xl md:text-4xl font-bold text-pink-500'>{countdown.seconds}</span>
                                    </div>
                                    <span className='text-xs md:text-sm text-rose-800 mt-1 font-medium'>Secs</span>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className='flex flex-col md:flex-row gap-6 items-center justify-center'>
                            <button 
                                onClick={handleClickYes}
                                style={{
                                    transform: `scale(${yesButtonSize})`,
                                    transition: 'all 0.3s ease'
                                }}
                                className='relative group overflow-hidden bg-linear-to-r from-red-500 via-pink-500 to-red-500 hover:from-red-600 hover:via-pink-600 hover:to-red-600 text-white font-bold py-4 px-12 rounded-full shadow-2xl hover:shadow-red-500/50 active:scale-95 transition-all duration-300'
                            >
                                <span className='relative z-10 text-2xl md:text-3xl flex items-center gap-3'>
                                    Yes! 💖
                                </span>
                                <div className='absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
                            </button>
                            
                            <button 
                                onClick={handleClickNo}
                                style={{
                                    transform: `scale(${noButtonSize})`,
                                    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                                    opacity: noButtonSize < 0.4 ? 0.3 : 1
                                }}
                                className='text-rose-400 hover:text-rose-600 font-medium py-3 px-8 rounded-full border-2 border-rose-300 hover:border-rose-500 transition-colors text-lg md:text-xl'
                            >
                                {noButtonSize > 0.6 ? 'No...' : noButtonSize > 0.4 ? 'Please?' : '🥺'}
                            </button>
                        </div>

                        {noButtonSize < 0.4 && (
                            <p className='text-center mt-6 text-red-600 font-semibold animate-pulse'>
                                The "No" button is disappearing... maybe say yes? 💕
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* "Reasons I Love You" Slideshow */}
            {showSlideshow && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-black/60 backdrop-blur-lg animate-fadeIn">
                    <div className="bg-linear-to-br from-rose-50 via-pink-50 to-red-50 p-8 md:p-12 rounded-4xl shadow-2xl max-w-2xl w-full relative overflow-hidden border-4 border-red-300">
                        {/* Decorative hearts */}
                        <div className='absolute top-4 left-4 text-3xl animate-pulse'>💕</div>
                        <div className='absolute top-4 right-4 text-3xl animate-pulse' style={{ animationDelay: '0.5s' }}>💕</div>
                        <div className='absolute bottom-4 left-4 text-3xl animate-pulse' style={{ animationDelay: '1s' }}>💕</div>
                        <div className='absolute bottom-4 right-4 text-3xl animate-pulse' style={{ animationDelay: '1.5s' }}>💕</div>
                        
                        <div className='relative z-10'>
                            <h3 className='font-aegean text-4xl md:text-5xl text-center bg-linear-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-8'>
                                Reasons I Love You
                            </h3>
                            
                            {/* Slideshow content */}
                            <div className='relative h-40 md:h-48 flex items-center justify-center mb-8'>
                                {reasons.map((reason, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
                                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    >
                                        <div className='bg-white/80 rounded-2xl p-8 shadow-xl border-2 border-red-200 text-center'>
                                            <p className='text-xl md:text-3xl text-rose-800 font-light'>
                                                {reason}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Navigation arrows */}
                            <div className='flex justify-center gap-6 mb-6'>
                                <button
                                    onClick={prevSlide}
                                    className='w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110'
                                >
                                    ←
                                </button>
                                <div className='flex items-center gap-2'>
                                    {reasons.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                index === currentSlide ? 'bg-red-500 w-6' : 'bg-red-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={nextSlide}
                                    className='w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110'
                                >
                                    →
                                </button>
                            </div>
                            
                            <p className='text-center text-sm text-rose-600 mb-4'>
                                Slide {currentSlide + 1} of {reasons.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Success Modal - Love Letter */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-lg animate-fadeIn">
                    <div className="bg-linear-to-br from-rose-50 via-pink-50 to-red-50 p-10 md:p-14 rounded-[3rem] shadow-2xl max-w-2xl w-full text-center border-8 border-red-400 relative overflow-hidden transform animate-scaleIn">
                        
                        {/* Decorative elements */}
                        <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M10 0L11 9L20 10L11 11L10 20L9 11L0 10L9 9Z" fill="%23ff69b4" fill-opacity="0.1"/%3E%3C/svg%3E")] opacity-30' />
                        
                        <div className="relative z-10">
                            <div className="text-8xl mb-8 animate-heartbeat">
                                💝
                            </div>
                            
                            <h2 className="font-aegean text-5xl md:text-6xl bg-linear-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
                                It's a Date!
                            </h2>
                            
                            <div className='bg-white/80 rounded-3xl p-8 mb-8 shadow-xl border-2 border-red-200'>
                                <p className="text-rose-800 text-lg md:text-xl leading-relaxed mb-4">
                                    Yay! You've made me the happiest! 💕
                                </p>
                                <p className="text-rose-600 text-base md:text-lg font-light italic">
                                    I can't wait to spend Valentine's Day with you!
                                </p>
                                <div className='mt-6 text-4xl'>
                                    🌹✨💖✨🌹
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setShowModal(false)}
                                className="w-full md:w-auto px-12 py-5 bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full font-bold text-xl shadow-2xl hover:shadow-red-500/50 active:scale-95 transition-all duration-300"
                            >
                                See you soon, Mahang ko! 💌
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invitation;