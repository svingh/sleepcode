import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AlarmSetModalProps {
  onClose: () => void;
  onSave: (time: string, label: string) => void;
}

const AlarmSetModal = ({ onClose, onSave }: AlarmSetModalProps) => {
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('Morning Challenge');

  const handleSave = () => {
    if (time && label) {
      onSave(time, label);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm bg-slate-900 border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Set Alarm
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="time" className="text-slate-300">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white text-2xl font-mono text-center"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="label" className="text-slate-300">Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter alarm label..."
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Save Alarm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlarmSetModal;
