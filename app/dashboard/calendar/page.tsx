'use client';
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { supabase } from "@/lib/supabase"


export default function TradingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // June 2025
  const [expandedCell, setExpandedCell] = useState(null);
  const [tradeData, setTradeData] = useState({});

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
  
        if (userError) throw userError;
  
        const userId = userData.user?.id;
        if (!userId) throw new Error("User not authenticated");
  
        const { data, error } = await supabase
          .from("trades")
          .select("*")
          .eq("user_id", userId)
          .order("entry_date", { ascending: true });
  
        if (error) throw error;
  
        const calendarData = {};
        data.forEach((trade) => {
          const date = formatDate(trade.entry_date);
          if (!calendarData[date]) {
            calendarData[date] = { profit: 0, trades: 0 };
          }
          calendarData[date].profit += trade.profit_loss || 0;
          calendarData[date].trades += 1;
        });
  
        setTradeData(calendarData);
      } catch (error) {
        console.error("Error fetching trades:", error);
      }
    };
  
    fetchTrades();
  }, [currentDate]); // Add dependency if you want to reload when month changes
  


  const getMonthName = (date) =>
    date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday as 0

    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const calendar = [];
    let week = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      week.push({ date: new Date(year, month, 1 - (firstDayOfWeek - i)), isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      week.push({ date: new Date(year, month, day), isCurrentMonth: true });
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      for (let i = 1; i <= 7 - week.length; i++) {
        week.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
      }
      calendar.push(week);
    }

    return calendar;
  };

  const formatDate = (input) => {
    const date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  

  const getBoxColor = (profit) => {
    if (profit > 0) return "bg-green-300 text-green-800 border-green-400";
    if (profit < 0) return "bg-red-300 text-red-800 border-red-400";
    return "bg-white border-gray-400";
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setExpandedCell(null);
  };

  const calendar = getDaysInMonth(currentDate);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <Button onClick={() => navigateMonth(-1)} variant="outline" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Prev
          </Button>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
            {getMonthName(currentDate)}
          </h2>
          <Button onClick={() => navigateMonth(1)} variant="outline" className="gap-2">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4">
          <div className="grid grid-cols-7 gap-[2px] sm:gap-2 mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-600 text-[10px] sm:text-sm"
              >
                {day}
              </div>
            ))}
          </div>

          {calendar.map((week, i) => (
            <div key={i} className="grid grid-cols-7 gap-[2px] sm:gap-2 mb-[2px] sm:mb-2">
              {week.map((dayObj, j) => {
                const formatted = formatDate(dayObj.date);
                const data = tradeData[formatted];
                const boxColor = data ? getBoxColor(data.profit) : "bg-white border-gray-200";
                const isCurrentMonth = dayObj.isCurrentMonth;
                const isExpanded = expandedCell === formatted;

                return (
                  <Card
                    key={`${i}-${j}`}
                    onClick={() =>
                      setExpandedCell((prev) => (prev === formatted ? null : formatted))
                    }
                    className={`aspect-square w-full ${boxColor} text-xs sm:text-sm border rounded-md flex flex-col justify-start items-start transition-all hover:shadow-md cursor-pointer overflow-hidden ${
                      !isCurrentMonth ? "opacity-30" : ""
                    }`}
                  >
                    <div className="self-end p-1 font-semibold text-[12px] sm:text-xs">
                      {dayObj.date.getDate()}
                    </div>

                    {/* Desktop view */}
                    {data && isCurrentMonth && (
                      <div className="hidden sm:flex flex-col px-1 text-left text-[15px] leading-tight mt-3">
                        <span className="font-bold truncate">
                          {data.profit > 0 ? "+" : ""}
                          {data.profit}
                        </span>
                        <span className="opacity-75 ">{data.trades} trades</span>
                      </div>
                    )}

                    {/* Mobile expanded view */}
                    {data && isCurrentMonth && isExpanded && (
                      <div className="sm:hidden flex flex-col px-1 text-left text-[9px] leading-tight -mt-1">
                        <span className="font-bold truncate">
                          {data.profit > 0 ? "+" : ""}
                          {data.profit}
                        </span>
                        <span className="opacity-75">{data.trades} trades</span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center space-x-4 sm:space-x-8 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-300 border-2 border-green-400 rounded" />
            <span className="text-gray-600">Profitable Day</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-300 border-2 border-red-400 rounded" />
            <span className="text-gray-600">Loss Day</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border-2 border-gray-400 rounded" />
            <span className="text-gray-600">No Trade Day</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
