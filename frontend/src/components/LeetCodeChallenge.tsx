import React, { useState, useEffect } from 'react';
import { AlertTriangle, Code, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LeetCodeChallengeProps {
  onSolved: () => void;
  initialSolvedCount: number;
  currentSolvedCount: number;
  fetchSolvedProblems: () => Promise<number>;
}

const LeetCodeChallenge = ({ onSolved, initialSolvedCount, currentSolvedCount, fetchSolvedProblems }: LeetCodeChallengeProps) => {
  const [isRinging, setIsRinging] = useState(true);
  const [showSolved, setShowSolved] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Simulate alarm ringing animation
    const interval = setInterval(() => {
      setIsRinging(prev => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsSolved = async () => {
    setIsChecking(true);
    try {
      const latestCount = await fetchSolvedProblems();
      if (latestCount > initialSolvedCount) {
        setShowSolved(true);
        setTimeout(() => {
          onSolved();
        }, 1500);
      } else {
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error checking solved count:", error);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } finally {
      setIsChecking(false);
    }
  };

  if (showSolved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm bg-green-900/40 border-green-700 backdrop-blur-sm text-center">
          <CardContent className="p-8">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-white mb-2">Problem Solved!</h2>
            <p className="text-green-200 text-lg">Great job! Alarm has been disabled.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm bg-red-900/40 border-red-700 backdrop-blur-sm text-center">
          <CardContent className="p-8">
            <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-white mb-2">Not So Fast!</h2>
            <p className="text-red-200 text-lg">We haven't detected a new solved problem yet. Please solve a problem first!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-900 p-4 pb-8 transition-all duration-500 ${isRinging ? 'brightness-110' : 'brightness-90'}`}>
      <div className="w-full max-w-sm mx-auto space-y-6">
        {/* Alarm Header */}
        <Card className={`bg-red-900/40 border-red-700 backdrop-blur-sm transition-all duration-500 ${isRinging ? 'ring-2 ring-red-500' : ''}`}>
          <CardContent className="p-6 text-center">
            <AlertTriangle className={`w-16 h-16 text-red-400 mx-auto mb-4 ${isRinging ? 'animate-bounce' : ''}`} />
            <h1 className="text-4xl font-bold text-white mb-3">⏰ ALARM!</h1>
            <p className="text-red-200 text-lg">Solve any LeetCode problem to turn off the alarm</p>
          </CardContent>
        </Card>

        {/* Challenge Instructions */}
        <Card className="bg-black/60 border-slate-600 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Code className="w-6 h-6 text-blue-400" />
              Your Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-slate-300 font-medium mb-2 text-lg">Instructions:</h3>
              <div className="text-slate-200 leading-relaxed text-base space-y-2">
                <p>1. Go to LeetCode.com</p>
                <p>2. Choose any problem you want to solve</p>
                <p>3. Submit your solution successfully</p>
                <p>4. Come back and mark as solved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="space-y-4">
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
            {isChecking ? "Checking..." : "I Solved a Problem!"}
          </Button>
        </div>

        {/* Instructions */}
        <Card className="bg-blue-500/10 border-blue-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-200 text-base font-medium">Verification Required</p>
                <p className="text-blue-300/80 text-sm mt-1">
                  The alarm will only stop when we detect that you've successfully solved a new LeetCode problem.
                  Your current solved count: {currentSolvedCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeetCodeChallenge;
