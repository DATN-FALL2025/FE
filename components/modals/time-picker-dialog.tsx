'use client'

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export const TimePickerDialog = ({
    value,
    onChange,
    label,
  }: {
    value: string | null;
    onChange: (time: string) => void;
    label: string;
  }) => {
    const hours = Array.from({ length: 24 }, (_, i) =>
      i.toString().padStart(2, "0")
    );
    const minutes = Array.from({ length: 60 }, (_, i) =>
      i.toString().padStart(2, "0")
    );
    const [isOpen, setIsOpen] = useState(false);
    const [tempHour, setTempHour] = useState(value?.split(":")[0] || "00");
    const [tempMinute, setTempMinute] = useState(value?.split(":")[1] || "00");
  
    const handleTimeSelect = (type: "hour" | "minute", value: string) => {
      if (type === "hour") {
        setTempHour(value);
      } else {
        setTempMinute(value);
      }
    };
  
    const handleConfirm = () => {
      const newTime = `${tempHour}:${tempMinute}`;
      onChange(newTime);
      setIsOpen(false);
    };
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <Clock className="mr-2 h-4 w-4" />
            {value || "Chọn thời gian"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <div className="font-medium text-sm">Giờ</div>
              <ScrollArea className="h-72 rounded-md border">
                <div className="p-2">
                  {hours.map((hour) => (
                    <Button
                      key={hour}
                      variant={hour === tempHour ? "default" : "ghost"}
                      className="w-full justify-start mb-1"
                      onClick={() => handleTimeSelect("hour", hour)}
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-sm">Phút</div>
              <ScrollArea className="h-72 rounded-md border">
                <div className="p-2">
                  {minutes.map((minute) => (
                    <Button
                      key={minute}
                      variant={minute === tempMinute ? "default" : "ghost"}
                      className="w-full justify-start mb-1"
                      onClick={() => handleTimeSelect("minute", minute)}
                    >
                      {minute}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm">
              Thời gian đã chọn:{" "}
              <span className="font-semibold">
                {tempHour}:{tempMinute}
              </span>
            </div>
            <Button
              onClick={handleConfirm}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  