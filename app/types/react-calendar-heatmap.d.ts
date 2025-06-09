declare module 'react-calendar-heatmap' {
  import * as React from 'react';
  export interface CalendarHeatmapValue {
    date: string;
    value: number;
  }
  export interface CalendarHeatmapProps {
    startDate: Date | string;
    endDate: Date | string;
    values: CalendarHeatmapValue[];
    classForValue?: (value: CalendarHeatmapValue | undefined) => string;
    tooltipDataAttrs?: (value: CalendarHeatmapValue | undefined) => any;
    showWeekdayLabels?: boolean;
    // ...other props as needed
  }
  const CalendarHeatmap: React.FC<CalendarHeatmapProps>;
  export default CalendarHeatmap;
} 