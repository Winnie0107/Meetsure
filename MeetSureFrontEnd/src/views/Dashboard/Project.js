import React, { useState } from "react";
import ProjectIntroPage from "views/Dashboard/ProjectIntroPage";
import ProjectSelectMembers from "views/Dashboard/ProjectSelectMembers";
import ProjectSelectTask from "views/Dashboard/ProjectSelectTask";
import ProjectSetProgressBar from "views/Dashboard/ProjectSetProgressBar";

function Project() {
    const [currentPage, setCurrentPage] = useState("intro"); // 初始顯示 ProjectIntroPage

    const handleNext = () => {
        if (currentPage === "intro") {
            setCurrentPage("selectMembers"); // 從 intro 切換到 ProjectSelectMembers
        } else if (currentPage === "selectMembers") {
            setCurrentPage("selectTask"); // 從 ProjectSelectMembers 切換到 ProjectSelectTask
        }
    };

    const handleSetProgressBar = () => {
        setCurrentPage("setProgressBar"); // 切換到 ProjectSetProgressBar
    };

    return (
        <div>
            {currentPage === "intro" && <ProjectIntroPage onStart={handleNext} />}
            {currentPage === "selectMembers" && <ProjectSelectMembers onNext={handleNext} />}
            {currentPage === "selectTask" && (
                <ProjectSelectTask onSetProgressBar={handleSetProgressBar} />
            )}
            {currentPage === "setProgressBar" && <ProjectSetProgressBar />}
        </div>
    );
}

export default Project;
