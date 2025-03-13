import React, { useEffect, useRef } from "react";
import Gantt from "frappe-gantt"; // 引入 frappe-gantt
import "../../assets/css/frappe-gantt.css"; // 引入 CSS
import {
    useColorModeValue,
    Box,
    Text,
    Divider,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";

const GanttChart = () => {
    const ganttRef = useRef(null);
    const cardBg = useColorModeValue("white", "gray.800");

    useEffect(() => {
        if (ganttRef.current) {
            const tasks = [
                {
                    id: "Task 1",
                    name: "設計階段",
                    start: "2025-03-01",
                    end: "2025-03-07",
                    progress: 100,
                    dependencies: "",
                },
                {
                    id: "Task 2",
                    name: "開發階段",
                    start: "2025-03-08",
                    end: "2025-03-15",
                    progress: 50,
                    dependencies: "Task 1",
                },
                {
                    id: "Task 3",
                    name: "測試階段",
                    start: "2025-03-16",
                    end: "2025-03-22",
                    progress: 30,
                    dependencies: "Task 2",
                },
                {
                    id: "Task 4",
                    name: "撰寫文件",
                    start: "2025-03-18",
                    end: "2025-03-28",
                    progress: 50,
                    dependencies: "Task 1",
                },
            ];

            // 進度條顏色
            const getProgressColor = (progress) => {
                if (progress <= 49) return "#f9d6d5"; // 紅色
                if (progress <= 70) return "#fde6c6"; // 橙色
                return "#d4f7dc"; // 綠色
            };

            const gantt = new Gantt(ganttRef.current, tasks, {
                on_click: (task) => console.log("點擊任務:", task),
                on_date_change: (task, start, end) => console.log("任務時間變更:", task, start, end),
                on_progress_change: (task, progress) => {
                    console.log("任務進度變更:", task, progress);
                    applyProgressColors();
                },
                view_mode: "Day",
                language: "zh",
            });

            // **函式：應用進度條顏色**
            const applyProgressColors = () => {
                setTimeout(() => {
                    document.querySelectorAll(".bar-progress").forEach((bar, index) => {
                        bar.style.fill = getProgressColor(tasks[index].progress);
                    });
                }, 500);
            };

            // **初次載入應用顏色**
            applyProgressColors();

            // **監聽 DOM 變化，防止滑動時顏色消失**
            const observer = new MutationObserver(() => {
                applyProgressColors();
            });

            observer.observe(ganttRef.current, { childList: true, subtree: true });

            // **清除監聽**
            return () => observer.disconnect();
        }
    }, []);

    return (
        <Card bg={cardBg} p="6" boxShadow="lg">
            {/* Header */}
            <CardHeader pb="4">
                <Text fontSize="lg" fontWeight="bold">專案甘特圖</Text>
                <Divider my="2" />
            </CardHeader>

            {/* 甘特圖區域 */}
            <Box height="400px" overflowX="auto">
                <div ref={ganttRef}></div>
            </Box>
        </Card>
    );
};

export default GanttChart;
