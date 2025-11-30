import { useState, useEffect, useRef } from 'react';
import { DemoRunner } from '../lib/demo/runner';
import { userDemoSteps } from '../lib/demo/scripts/user-demo';
import { adminDemoSteps } from '../lib/demo/scripts/admin-demo';
import JwtApi from '../api/JwtApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export const useDemo = () => {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [demoType, setDemoType] = useState('user'); // 'user' or 'admin'
    const runnerRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const startDemo = async (type) => {
        setDemoType(type);
        setIsActive(true);

        // Authenticate as demo user
        try {
            const response = await JwtApi.post('/demo/auth/demo-token', { role: type });
            const { token, user } = response;
            dispatch(setCredentials({ accessToken: token, user }));

            // Initialize runner
            const steps = type === 'user' ? userDemoSteps : adminDemoSteps;
            runnerRef.current = new DemoRunner(steps, {
                onStepChange: (index, step) => setCurrentStep({ index, ...step }),
                onComplete: () => {
                    setIsPlaying(false);
                    // Show replay modal or something
                },
                onStop: () => {
                    setIsActive(false);
                    setIsPlaying(false);
                    setCurrentStep(null);
                },
                navigate: (path) => navigate(path)
            });

            runnerRef.current.setSpeed(speed);
            runnerRef.current.start();
            setIsPlaying(true);

        } catch (error) {
            console.error('Failed to start demo:', error);
            setIsActive(false);
        }
    };

    const stopDemo = () => {
        if (runnerRef.current) {
            runnerRef.current.stop();
        }
    };

    const togglePlay = () => {
        if (runnerRef.current) {
            if (isPlaying) {
                runnerRef.current.pause();
            } else {
                runnerRef.current.start();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const changeSpeed = (newSpeed) => {
        setSpeed(newSpeed);
        if (runnerRef.current) {
            runnerRef.current.setSpeed(newSpeed);
        }
    };

    return {
        isActive,
        currentStep,
        isPlaying,
        speed,
        demoType,
        startDemo,
        stopDemo,
        togglePlay,
        changeSpeed
    };
};
