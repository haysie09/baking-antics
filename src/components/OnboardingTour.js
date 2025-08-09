import React, { useState, useEffect, useLayoutEffect } from 'react';

// Define all the steps for our tour
const tourSteps = [
    {
        element: '#generator-box',
        title: 'Unsure what to bake?',
        content: 'Use this feature to generate ideas! "Help Me Decide" gives you a random idea, while "Use My Ideas" picks from your own saved list.',
    },
    {
        element: '#quick-add-buttons',
        title: 'Quick Actions',
        content: 'Easily add your past bakes, new ideas, or schedule future bakes with these handy shortcuts.',
    },
    {
        element: '#navigation-buttons',
        title: 'Your Baking Hub',
        content: 'Navigate to your Cookbook, Journal, or Idea Pad. This is where all your baking magic is stored!',
    },
    {
        element: '#upcoming-bakes',
        title: 'Upcoming Bakes',
        content: 'This section reminds you what you have planned. Press the "+" to schedule a new bake and stay organized.',
    },
    {
        element: '#stats-box',
        title: 'Monitor Your Progress',
        content: 'See how many delicious bakes you\'ve made and the hours you\'ve spent perfecting your craft. Use the filter to change the time period.',
    },
    {
        element: '#calendar-box',
        title: 'Interactive Calendar',
        content: 'Get a full overview of your baking history. Click the arrows to navigate through months and see your stats update in real-time!',
    },
];

const OnboardingTour = ({ onFinish }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [spotlightStyle, setSpotlightStyle] = useState({});

    const currentStep = tourSteps[stepIndex];

    // This effect calculates the position of the spotlight
    useLayoutEffect(() => {
        if (currentStep.element) {
            const targetElement = document.querySelector(currentStep.element);
            if (targetElement) {
                const rect = targetElement.getBoundingClientRect();
                setSpotlightStyle({
                    width: `${rect.width + 20}px`,
                    height: `${rect.height + 20}px`,
                    top: `${rect.top - 10}px`,
                    left: `${rect.left - 10}px`,
                });
            }
        }
    }, [stepIndex, currentStep.element]);

    const handleNext = () => {
        if (stepIndex < tourSteps.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            onFinish();
        }
    };

    const handleBack = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-60"></div>
            
            {/* Spotlight */}
            <div 
                className="absolute bg-white rounded-2xl transition-all duration-300"
                style={{ ...spotlightStyle, mixBlendMode: 'destination-out' }}
            ></div>

            {/* Pop-up with text */}
            <div className="absolute p-4 w-full h-full flex items-center justify-center">
                 <div className="bg-app-white rounded-2xl p-6 w-full max-w-sm shadow-2xl font-patrick-hand text-center relative" style={spotlightStyle}>
                    <h3 className="text-2xl font-bold text-burnt-orange mb-2">{currentStep.title}</h3>
                    <p className="text-lg text-app-grey font-montserrat">{currentStep.content}</p>
                    
                    <div className="flex justify-between items-center mt-6 font-montserrat">
                        <span className="text-sm text-app-grey/70">{stepIndex + 1} / {tourSteps.length}</span>
                        <div className="flex gap-2">
                            {stepIndex > 0 && <button onClick={handleBack} className="bg-gray-200 text-app-grey py-2 px-4 rounded-lg text-sm">Back</button>}
                            <button onClick={handleNext} className="bg-add-idea text-white py-2 px-4 rounded-lg text-sm">
                                {stepIndex === tourSteps.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default OnboardingTour;
