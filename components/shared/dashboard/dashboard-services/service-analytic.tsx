import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React from "react";
import AnalyticCard from "./service-analytic-card";
import DottedSeparator from "@/components/shared/custom-ui/dotted-separator";
import { getStatisTicServices } from "@/features/statistic/action/statistic";

const ServiceAnalytic = async () => {
  const statisticService = await getStatisTicServices();
  const data = statisticService.data;

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticCard
            title="Tổng dịch vụ đã kích hoạt"
            value={data!.totalActivedServices}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticCard title="Dịch vụ chính" value={data!.parentServices} />+
          
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticCard
            title="Dịch vụ trong dịch vụ chính"
            value={data!.childServices}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default ServiceAnalytic;
