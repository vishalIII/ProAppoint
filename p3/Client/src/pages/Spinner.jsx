// DotsLoader.jsx
import React from 'react';

const DotsLoader = () => {
    return (
        <div className="flex justify-center items-center space-x-2">
            <div className="animate-bounce w-4 h-4 bg-slate-800 rounded-full"></div>
            <div className="animate-bounce w-4 h-4 bg-slate-800 rounded-full animation-delay-200"></div>
            <div className="animate-bounce w-4 h-4 bg-slate-800 rounded-full animation-delay-400"></div>
        </div>
    );
};

export default DotsLoader;
