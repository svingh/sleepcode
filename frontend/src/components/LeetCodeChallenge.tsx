import {
  AlertTriangle,
  Code,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface LeetCodeChallengeProps {
  onSolved: () => void;
  initialSolvedCount: number;
  currentSolvedCount: number;
  fetchSolvedProblems: () => Promise<number>;
}

const LeetCodeChallenge = ({
  onSolved,
  initialSolvedCount,
  currentSolvedCount,
  fetchSolvedProblems,
}: LeetCodeChallengeProps) => {
  const [isRinging, setIsRinging]   = useState(true);
  const [showError, setShowError]   = useState(false);
  const [showSolved, setShowSolved] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // flash animation
  useEffect(() => {
    const iv = setInterval(() => setIsRinging(r => !r), 500);
    return () => clearInterval(iv);
  }, []);

  // start alarm on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.5;
    audio.play().catch(() => {
      console.warn('Autoplay blocked — will start on user interaction');
    });
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleMarkAsSolved = async () => {
    if (isChecking) return;
    setIsChecking(true);

    // If audio never started (autoplay blocked), this play() will succeed here:
    audioRef.current?.play().catch(() => {});

    try {
      const latest = await fetchSolvedProblems();
      if (latest > initialSolvedCount) {
        // nly pause on true success
        audioRef.current?.pause();
        audioRef.current!.currentTime = 0;

        setShowSolved(true);
        setTimeout(onSolved, 1500);
      } else {
        // keep ringing underneath
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-900 p-4 pb-8 overflow-hidden">
      {/* always-mounted audio */}
      <audio ref={audioRef} preload="auto">
        <source src="/alarm-sound.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      {/* Base ringing screen */}
      <div
        className={`transition-all duration-500 ${
          isRinging ? 'brightness-110' : 'brightness-90'
        }`}
      >
        <div className="w-full max-w-sm mx-auto space-y-6">
          <Card
            className={`bg-red-900/40 border-red-700 backdrop-blur-sm transition-all duration-500 ${
              isRinging ? 'ring-2 ring-red-500' : ''
            }`}
          >
            <CardContent className="p-6 text-center">
              <AlertTriangle
                className={`w-16 h-16 text-red-400 mx-auto mb-4 ${
                  isRinging ? 'animate-bounce' : ''
                }`}
              />
              <h1 className="text-4xl font-bold text-white mb-3">
                ⏰ ALARM!
              </h1>
              <p className="text-red-200 text-lg">
                Solve any LeetCode problem to turn off the alarm
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-slate-600 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Code className="w-6 h-6 text-blue-400" />
                Your Challenge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-slate-300 font-medium mb-2 text-lg">
                Instructions:
              </h3>
              <div className="text-slate-200 leading-relaxed text-base space-y-2">
                <p>1. Go to LeetCode.com</p>
                <p>2. Choose any problem you want to solve</p>
                <p>3. Submit your solution successfully</p>
                <p>4. Come back and mark as solved</p>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleMarkAsSolved}
            disabled={isChecking}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-xl font-semibold"
          >
            {isChecking ? (
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            ) : (
              <CheckCircle className="w-6 h-6 mr-3" />
            )}
            {isChecking ? 'Checking...' : 'I Solved a Problem!'}
          </Button>

          <Card className="bg-blue-500/10 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-200 text-base font-medium">
                    Verification Required
                  </p>
                  <p className="text-blue-300/80 text-sm mt-1">
                    The alarm will only stop when we detect that you’ve
                    solved a new LeetCode problem.
                    <br />
                    Current count: {currentSolvedCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ERROR OVERLAY (rings underneath) */}
      {showError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <Card className="w-full max-w-sm bg-red-900/40 border-red-700 backdrop-blur-sm text-center">
            <CardContent className="p-8">
              <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4 animate-pulse" />
              <h2 className="text-3xl font-bold text-white mb-2">
                Not So Fast!
              </h2>
              <p className="text-red-200 text-lg">
                We haven’t detected a new solved problem yet. Please solve one
                first!
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SUCCESS OVERLAY */}
      {showSolved && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <Card className="w-full max-w-sm bg-green-900/40 border-green-700 backdrop-blur-sm text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4 animate-pulse" />
              <h2 className="text-3xl font-bold text-white mb-2">
                Problem Solved!
              </h2>
              <p className="text-green-200 text-lg">
                Great job! Alarm has been disabled.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LeetCodeChallenge;
