import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectIntroPage from "views/Dashboard/ProjectIntroPage";
import ProjectSelectMembers from "views/Dashboard/ProjectSelectMembers";
import ProjectSelectTask from "views/Dashboard/ProjectSelectTask";
import ProjectTimeline from "views/Dashboard/ProjectSetProgressBar";

function Project() {
    const [currentPage, setCurrentPage] = useState("intro");
    const [currentStep, setCurrentStep] = useState(1); // 控制內部步驟
    const [completedSteps, setCompletedSteps] = useState(new Set()); // ✅ 記錄已完成的步驟

    const userEmail = localStorage.getItem("user_email") || "";
    const token = localStorage.getItem("token");  // 或你儲存 token 的 key 名稱


    useEffect(() => {
        if (!userEmail) {
            console.warn("⚠️ `userEmail` 未定義，請確認登入狀態！");
        } else {
            console.log("✅ 獲取 `userEmail`:", userEmail);
        }
    }, [userEmail]);


    // **✅ 初始化 `projectData`，確保不為 `undefined`**
    const [projectData, setProjectData] = useState({
        name: "",
        description: "",
        members: ["自己"],
        selectedTasks: [],
        ownerEmail: userEmail, // 🆕 記錄專案擁有者
    });


    // **✅ 限制只能返回已完成的步驟**
    const handleStepClick = (step) => {
        if (step === 1 || step === 2) {
            setCurrentPage("selectMembers");
            setCurrentStep(step);
        } else if (completedSteps.has(step - 1)) {
            if (step === 3) setCurrentPage("selectTask");
            else if (step === 4) setCurrentPage("setProgressBar");
        }
    };

    // **🚀 儲存專案**
    const handleSubmit = async () => {
        console.log("🚀 送出的 projectData (原始):", JSON.stringify(projectData, null, 2));

        const formattedData = {
            name: projectData.name,
            description: projectData.description,
            members: projectData.members
                .filter(member => typeof member === "object" && member.id)  // 只保留有 id 的
                .map(member => member.id),  // 只傳 user ID

            tasks: projectData.selectedTasks.map(task => ({ name: task, completed: false })), // ✅ 仍然是 { name, completed }
        };

        console.log("📢 轉換後的 projectData:", JSON.stringify(formattedData, null, 2));

        const token = localStorage.getItem("token"); // ✅ 加上這行

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/projects/", formattedData, {
                headers: {

                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,y
                }
            });


            alert("🎉 專案已成功儲存！");
        } catch (error) {
            console.error("❌ 儲存專案時發生錯誤:", error.response?.data || error);
            alert(`❌ 專案儲存失敗！錯誤訊息：${JSON.stringify(error.response?.data)}`);
        }
    };


    return (
        <div>
            {currentPage === "intro" && (
                <ProjectIntroPage
                    onStart={() => handleStepClick(1)}
                    handleStepClick={handleStepClick}
                />
            )}
            {currentPage === "selectMembers" && (
                <ProjectSelectMembers
                    onNext={() => {
                        setCompletedSteps((prev) => new Set(prev).add(2)); // ✅ 標記 Step 2 完成
                        handleStepClick(3);
                    }}
                    handleStepClick={handleStepClick}
                    currentStep={currentStep}
                    projectData={projectData}
                    setProjectData={setProjectData} // ✅ 記錄專案名稱 & 成員
                    userEmail={userEmail} // ✅ 傳遞 userEmail 給 `ProjectSelectMembers`
                />
            )}
            {currentPage === "selectTask" && (
                <ProjectSelectTask
                    onSetProgressBar={() => {
                        setCompletedSteps((prev) => new Set(prev).add(3)); // ✅ 標記 Step 3 完成
                        handleStepClick(4);
                    }}
                    handleStepClick={handleStepClick}
                    projectData={projectData}
                    setProjectData={setProjectData} // ✅ 記錄選擇的任務
                />
            )}
            {currentPage === "setProgressBar" && (
                <ProjectTimeline
                    handleStepClick={handleStepClick}
                    projectData={projectData}
                    handleSubmit={handleSubmit} // ✅ 按下 "開始管理專案" 時送出數據
                />
            )}
        </div>
    );
}

export default Project;
