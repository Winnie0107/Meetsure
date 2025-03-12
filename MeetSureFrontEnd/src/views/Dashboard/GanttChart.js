import React, { useEffect, useRef } from "react";
import Gantt from "frappe-gantt"; // 匯入 frappe-gantt
import "../../assets/css/frappe-gantt.css"; // 匯入 CSS

const GanttChart = () => {
    const ganttRef = useRef(null);

    useEffect(() => {
        if (ganttRef.current) {
            const tasks = [
                {
                    id: "Task 1",
                    name: "設計階段",
                    start: "2025-03-01",
                    end: "2025-03-07",
                    progress: 100, // 進度條
                    dependencies: "",
                },
                {
                    id: "Task 2",
                    name: "開發階段",
                    start: "2025-03-08",
                    end: "2025-03-15",
                    progress: 50,
                    dependencies: "Task 1", // 這個任務依賴 Task 1
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

            // 定義進度條顏色
            const getProgressColor = (progress) => {
                if (progress <= 49) return "#f9d6d5"; // 紅色
                if (progress <= 70) return "#fde6c6"; // 橙色
                return "#d4f7dc"; // 綠色
            };

            new Gantt(ganttRef.current, tasks, {
                on_click: (task) => {
                    console.log("點擊任務:", task);
                },
                on_date_change: (task, start, end) => {
                    console.log("任務時間變更:", task, start, end);
                },
                on_progress_change: (task, progress) => {
                    console.log("任務進度變更:", task, progress);
                },
                view_mode: "Day", // 也可以改成 "Week" 或 "Month"
                language: "zh", // 設定語言
            });

            // **動態改變 progress 顏色**
            setTimeout(() => {
                document.querySelectorAll(".bar-progress").forEach((bar, index) => {
                    bar.style.fill = getProgressColor(tasks[index].progress);
                });
            }, 500);
        }
    }, []);

    return (
        <div>
            <div ref={ganttRef}></div> {/* frappe-gantt 會渲染在這個 div */}
        </div>
    );
};

export default GanttChart;
