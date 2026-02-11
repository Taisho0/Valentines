import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti';

const Invitation = () => {
    const [noButtonSize, setNoButtonSize] = useState(1);
    const [yesButtonSize, setYesButtonSize] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
    const [hearts, setHearts] = useState([]);

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

    const handleClickYes = () => {
        setIsEnvelopeOpen(true);
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
        }, 600);
    };

    const handleClickNo = () => {
        if (noButtonSize > 0.3) {
            setNoButtonSize(prev => prev * 0.8);
            setYesButtonSize(prev => prev * 1.15);
        }
    };

    return (
        <div className='relative w-full min-h-screen flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-rose-900 via-pink-800 to-red-900'>
            {/* Animated gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-br from-pink-500/20 via-transparent to-red-500/20 animate-pulse-slow' />
            
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
                <div className='bg-gradient-to-br from-rose-100 to-pink-50 p-10 md:p-16 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border-4 border-red-300/50 max-w-2xl w-full relative overflow-hidden'>
                    
                    {/* Decorative corner hearts */}
                    <div className='absolute top-4 left-4 text-4xl text-red-400 animate-pulse'>❤️</div>
                    <div className='absolute top-4 right-4 text-4xl text-red-400 animate-pulse' style={{ animationDelay: '0.5s' }}>❤️</div>
                    <div className='absolute bottom-4 left-4 text-4xl text-red-400 animate-pulse' style={{ animationDelay: '1s' }}>❤️</div>
                    <div className='absolute bottom-4 right-4 text-4xl text-red-400 animate-pulse' style={{ animationDelay: '1.5s' }}>❤️</div>
                    
                    {/* Content */}
                    <div className='relative z-10'>
                        <div className='text-center mb-8'>
                            <div className='text-7xl md:text-9xl mb-6 animate-bounce-slow'>💌</div>
                            <h1 className='font-aegean text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-pink-500 to-red-600 mb-4 leading-tight'>
                                Be My Valentine?
                            </h1>
                            <p className='text-rose-800 text-lg md:text-xl font-light italic'>
                                "My heart beats only for you..."
                            </p>
                        </div>

                        <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-10 border-2 border-red-200'>
                            <p className='text-rose-900 text-center text-sm md:text-base font-medium tracking-wide'>
                                📅 February 14, 2026 • 7:00 PM
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className='flex flex-col md:flex-row gap-6 items-center justify-center'>
                            <button 
                                onClick={handleClickYes}
                                style={{
                                    transform: `scale(${yesButtonSize})`,
                                    transition: 'all 0.3s ease'
                                }}
                                className='relative group overflow-hidden bg-gradient-to-r from-red-500 via-pink-500 to-red-500 hover:from-red-600 hover:via-pink-600 hover:to-red-600 text-white font-bold py-4 px-12 rounded-full shadow-2xl hover:shadow-red-500/50 active:scale-95 transition-all duration-300'
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

            {/* Success Modal - Love Letter */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-lg animate-fadeIn">
                    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 p-10 md:p-14 rounded-[3rem] shadow-2xl max-w-2xl w-full text-center border-8 border-red-400 relative overflow-hidden transform animate-scaleIn">
                        
                        {/* Decorative elements */}
                        <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M10 0L11 9L20 10L11 11L10 20L9 11L0 10L9 9Z" fill="%23ff69b4" fill-opacity="0.1"/%3E%3C/svg%3E")] opacity-30' />
                        
                        <div className="relative z-10">
                            <div className="text-8xl mb-8 animate-heartbeat">
                                💝
                            </div>
                            
                            <h2 className="font-aegean text-5xl md:text-6xl bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
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
                                className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full font-bold text-xl shadow-2xl hover:shadow-red-500/50 active:scale-95 transition-all duration-300"
                            >
                                See you soon, love! 💌
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invitation;