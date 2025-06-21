import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Plus, Trophy, Code, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AlarmSetModal from './AlarmSetModal';
import LeetCodeChallenge from './LeetCodeChallenge';


interface Alarm {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
}

const AlarmClock = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [showSetAlarm, setShowSetAlarm] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState(0);
  const username = localStorage.getItem("leetcodeUsername") || "CodeAlarm";

  // Fetch solved problems count on component mount and after solving a problem
  const fetchSolvedProblems = async () => {
    try {
      const response = await fetch(`http://localhost:3000/${username}/solved`);
      const data = await response.json();
      setSolvedProblems(data.solvedProblem || 0);
    } catch (error) {
      console.error("Error fetching solved problems:", error);
    }
  };

  useEffect(() => {
    fetchSolvedProblems();
  }, [username]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check for alarm triggers
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      alarms.forEach(alarm => {
        if (alarm.isActive && alarm.time === currentTimeString && !isAlarmRinging) {
          triggerAlarm();
        }
      });
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [alarms, isAlarmRinging]);

  const triggerAlarm = () => {
    setIsAlarmRinging(true);
  };

  const handleProblemSolved = () => {
    // Fetch the updated count after marking a problem as solved
    fetchSolvedProblems();
    setIsAlarmRinging(false);
  };

  const addAlarm = (time: string, label: string) => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time,
      label,
      isActive: true
    };
    setAlarms(prev => [...prev, newAlarm]);
    setShowSetAlarm(false);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
      )
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Add logout handler
  const handleLogout = () => {
    localStorage.removeItem("leetcodeUsername");
    navigate("/login");
  };

  if (isAlarmRinging) {
    return (
      <LeetCodeChallenge 
        onSolved={handleProblemSolved}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-8">
      <div className="w-full max-w-sm mx-auto space-y-6">
        {/* Header with stats */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-orange-400" />
            <h1 className="text-xl font-bold uppercase text-white">{username}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400">
              {solvedProblems} solved
            </Badge>
          </div>
        </div>

        {/* Current Time Display - Made larger for mobile */}
        <Card className="bg-black/40 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="text-6xl font-mono font-bold text-white mb-3">
              {formatTime(currentTime)}
            </div>
            <div className="text-slate-400 text-base">
              {formatDate(currentTime)}
            </div>
          </CardContent>
        </Card>

        {/* Alarms List */}
        <Card className="bg-black/40 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-white text-lg">Alarms</CardTitle>
              <Button
                onClick={() => setShowSetAlarm(true)}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {alarms.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">No alarms set</p>
                <p className="text-sm">Add an alarm to start coding challenges!</p>
              </div>
            ) : (
              alarms.map(alarm => (
                <div
                  key={alarm.id}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div>
                    <div className="text-3xl font-mono font-bold text-white">
                      {alarm.time}
                    </div>
                    <div className="text-base text-slate-400">{alarm.label}</div>
                  </div>
                  <Button
                    onClick={() => toggleAlarm(alarm.id)}
                    variant={alarm.isActive ? "default" : "outline"}
                    size="lg"
                    className={alarm.isActive ? "bg-green-500 hover:bg-green-600 text-lg px-6" : "text-lg px-6"}
                  >
                    {alarm.isActive ? "ON" : "OFF"}
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-orange-500/10 border-orange-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Code className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-orange-200 text-base font-medium">How it works</p>
                <p className="text-orange-300/80 text-sm mt-1">
                  When your alarm rings, solve any LeetCode problem of your choice to turn it off! 
                  Each solved problem increases your counter.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updated Logout Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>

      {showSetAlarm && (
        <AlarmSetModal
          onClose={() => setShowSetAlarm(false)}
          onSave={addAlarm}
        />
      )}
    </div>
  );
};

export default AlarmClock;
