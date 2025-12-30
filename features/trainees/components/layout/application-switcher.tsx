"use client";

import { Check, ChevronsUpDown, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { TraineeApplication } from "../../hooks/use-student-data";

interface ApplicationSwitcherProps {
  applications: TraineeApplication[];
  selectedApplicationId: string | null;
  onSelectApplication: (applicationId: string) => void;
}

export const ApplicationSwitcher = ({
  applications,
  selectedApplicationId,
  onSelectApplication,
}: ApplicationSwitcherProps) => {
  const [open, setOpen] = useState(false);

  const selectedApp = applications.find(
    (app) => app.id === selectedApplicationId
  );

  if (applications.length === 0) {
    return null;
  }

  // If only one application, show it without switcher
  if (applications.length === 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
        <GraduationCap className="w-4 h-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {applications[0].courseName}
          </span>
          <span className="text-xs text-muted-foreground">
            {applications[0].positionName}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select an application"
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <GraduationCap className="w-4 h-4 shrink-0" />
            <div className="flex flex-col items-start overflow-hidden">
              <span className="text-sm font-medium truncate">
                {selectedApp?.courseName || "Select application..."}
              </span>
              {selectedApp && (
                <span className="text-xs text-muted-foreground truncate">
                  {selectedApp.positionName}
                </span>
              )}
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search applications..." />
          <CommandList>
            <CommandEmpty>No application found.</CommandEmpty>
            <CommandGroup heading="Your Applications">
              {applications.map((app) => (
                <CommandItem
                  key={app.id}
                  value={app.id}
                  onSelect={() => {
                    onSelectApplication(app.id);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <GraduationCap className="w-4 h-4" />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <span className="text-sm font-medium truncate">
                        {app.courseName}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {app.positionName} • {app.courseCode}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Enrolled: {app.enrollmentDate.toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4 shrink-0",
                      selectedApplicationId === app.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
