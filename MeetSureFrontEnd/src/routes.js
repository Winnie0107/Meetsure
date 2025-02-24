// import
/* eslint-disable no-unused-vars */

import React, { Component } from 'react';
import Dashboard from "views/Dashboard/Dashboard.js";
import Tables from "views/Dashboard/Tables.js";
import Billing from "views/Dashboard/Billing.js";
import RTLPage from "views/RTL/RTLPage.js";
import Profile from "views/Dashboard/Profile.js";
import SignIn from "views/Pages/SignIn.js";
import SignUp from "views/Pages/SignUp.js";
import AIChat from "views/Dashboard/AIChat.js";
import AIWrite from "views/Dashboard/AIWrite.js";
import AITranslate from "views/Dashboard/AITranslate.js";
import MeetSure from "views/Dashboard/MeetSure.js";
import UserManagement from "views/Dashboard/UserManagement.js";
import Community from "views/Dashboard/Community.js";
import AICheck from "views/Dashboard/AICheck.js";
import HomePage from "views/Pages/HomePage.js";
import Project from "views/Dashboard/Project.js";
import AIToolsPage from "views/Dashboard/AIToolsPage.js"; // 確保導入
import Company from "views/Pages/company.js";
import AdminDashboard from "views/Pages/AdminDashboard.js";
import AccountManagement from "views/Pages/AccountManagement.js";
import AdminSignin from "views/Pages/AdminSignin.js";
import CompanyApply from "views/Pages/CompanyApply.js";
import ErrorLogs from "views/Pages/ErrorLogs.js";
import ProjectManagement from "views/Dashboard/ProjectManagement.js";


import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
  ChatIcon,
  PenIcon,
  GlobeIcon,
} from "components/Icons/Icons";
import { CheckIcon } from '@chakra-ui/icons';

var dashRoutes = [
  {
    path: "/dashboard",
    name: "主控版",
    rtlName: "Dashboard",
    icon: <HomeIcon color='inherit' />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/project",
    name: "建立專案",
    rtlName: "لوحة القيادة",
    icon: <StatsIcon color='inherit' />,
    component: Project,
    layout: "/admin",
  },
  {
    path: "/meetsure",
    name: "MeetSure",
    rtlName: "MeetSure",
    icon: <DocumentIcon color='inherit' />,
    component: MeetSure,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "媒體庫",
    rtlName: "لوحة القيادة",
    icon: <StatsIcon color='inherit' />,
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/community",
    name: "我的社群",
    rtlName: "لوحة القيادة",
    icon: <StatsIcon color='inherit' />,
    component: Community,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "個人檔案",
    rtlName: "Profile",
    icon: <PersonIcon color='inherit' />,
    secondaryNavbar: true,
    component: Profile,
    layout: "/admin",
  },
  {
    path: "/signin",
    name: "登入",
    rtlName: "لوحة القيادة",
    icon: <RocketIcon color='inherit' />,
    component: SignIn,
    layout: "/auth",
  },
  {
    path: "/signup",
    name: "註冊",
    rtlName: "لوحة القيادة",
    icon: <RocketIcon color='inherit' />,
    component: SignUp,
    layout: "/auth",
  },
  {
    path: "/AIToolsPage",
    name: "AI TOOLS",
    icon: <PenIcon color='inherit' />,
    component: AIToolsPage,
    layout: "/admin",
    views: [
      {
        path: "/aiwrite",
        name: "AI 寫作",
        component: AIWrite,
        layout: "/admin",
      },
      {
        path: "/aichat",
        name: "AI 聊天室",
        component: AIChat,
        layout: "/admin",
      },
      {
        path: "/aitranslate",
        name: "AI 翻譯",
        component: AITranslate,
        layout: "/admin",
      },
      {
        path: "/aicheck",
        name: "語法檢查",
        component: AICheck,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/projectmanagement",
    name: "專案管理",
    icon: <RocketIcon color='inherit' />,
    component: ProjectManagement,
    layout: "/admin",
  },
  {
    path: "/homepage",
    component: HomePage,
    name: "主頁",
    layout: "/auth",
    icon: <HomeIcon color='inherit' />,
  },
  {
    path: "/company",
    name: "公司帳號申請",
    rtlName: "Company Account",
    component: Company,
    layout: "/auth",
  },
  {
    path: "/adminsignin",
    component: AdminSignin,
    layout: "/auth",
  },
  {
    path: "/admindashboard",
    component: AdminDashboard,
    layout: "/backstage",
  }, {
    path: "/accountmanagement",
    component: AccountManagement,
    layout: "/backstage",
  }, {
    path: "/companyapply",
    component: CompanyApply,
    layout: "/backstage",
  }, {
    path: "/errorlogs",
    component: ErrorLogs,
    layout: "/backstage",
  },
  {
    path: "/usermanagement",
    //name: "用戶管理",
    //rtlName: "لوحة القيادة",
    //icon: <PersonIcon color='inherit' />,
    component: UserManagement,
    layout: "/admin",
  },
];

export default dashRoutes;
