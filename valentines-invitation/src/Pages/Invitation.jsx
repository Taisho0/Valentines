import React, { useState } from 'react'
import confetti from 'canvas-confetti';
const Invitation = () => {
    const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
    const [showModal, setShowModal] = useState(false);
    const handleClickYes = () => {
        setShowModal(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff4d6d', '#ff758f', '#ffffff']
        });
    };
    const moveButton = () => {
        const randomX = Math.random() * 200 - 100;
        const randomY = Math.random() * 200 - 100;
        
        setNoButtonPos({ x: randomX, y: randomY });
    };
  return (
        <div className='bg-container w-full flex items-center justify-center p-6 relative overflow-hidden'>
            <div className='bg-white/10 backdrop-blur-lg border border-white/20 p-8 md:p-12 rounded-4xl shadow-2xl flex flex-col items-center w-full max-w-[90%] md:max-w-2xl relative z-10 transition-all duration-500'>
                <span className='font-aegean text-5xl md:text-8xl text-white text-center leading-[1.1] drop-shadow-2xl'>
                    Will you be my <br/>
                    <span className='italic text-pink-300 block mt-2'>Valentine?</span>
                </span>

                <p className='text-white/70 mt-8 font-light tracking-[0.2em] uppercase text-[10px] md:text-xs text-center border-y border-white/20 py-2'>
                    February 14, 2026 • 7:00 PM
                </p>
                <div className='flex flex-row gap-6 md:gap-12 mt-16 items-center justify-center w-full'>
                    <button 
                        onClick={handleClickYes} 
                        className='group relative px-8 md:px-10 py-3 md:py-4 font-bold text-white transition-all duration-300 active:scale-90 hover:cursor-pointer z-20'
                    >
                        <span className='absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-1 -translate-y-1 md:-translate-x-2 md:-translate-y-2 bg-pink-500 group-hover:translate-x-0 group-hover:translate-y-0'></span>
                        <span className='absolute inset-0 w-full h-full border-2 border-white'></span>
                        <span className='relative text-xl md:text-2xl uppercase tracking-tighter'>Yes!</span>
                    </button>
                    <button 
                        onMouseEnter={moveButton}
                        onTouchStart={moveButton}
                        style={{ 
                            transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                            transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                        }}
                        className='px-4 py-2 text-white/40 hover:text-white border-b border-transparent hover:border-white uppercase text-[10px] md:text-sm tracking-widest transition-colors'
                    >
                        Maybe next time
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md transition-opacity duration-300">
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl max-w-87.5 w-full text-center border-t-10 border-pink-500 transform transition-all animate-in zoom-in-75 slide-in-from-bottom-10 duration-500">
                        <div className="text-6xl mb-6 animate-bounce">❤️</div>
                        <h2 className="font-aegean text-4xl md:text-5xl text-gray-800 mb-4">It's a Date!</h2>
                        <p className="text-gray-500 font-light leading-relaxed mb-8 text-sm md:text-base">
                            Yay! I'm so happy! <br/> 
                            I'll see you on the 14th, love.
                        </p>
                        <button 
                            onClick={() => setShowModal(false)}
                            className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 active:scale-95 transition-transform uppercase tracking-widest text-xs"
                        >
                            See you soon!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invitation
