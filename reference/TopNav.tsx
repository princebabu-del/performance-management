'use client';

/**
 * topbar.tsx
 *
 * Self-contained, hardcoded replica of the Lumber Topbar.
 * No auth, no store, no API calls — all nav data is inlined.
 * Drop this file into any project and render <Topbar /> to preview
 * the exact topbar structure and interactions.
 *
 * Derived from:
 *   src/components/ui-global/Topbar/index.tsx
 *   src/components/ui-global/Topbar/NavbarItem.tsx
 *   src/components/ui-global/Topbar/NavbarMenuOverflowItem.tsx
 *   src/components/ui-global/Topbar/pages.ts
 *   src/components/ui-global/Topbar/style.ts
 *   src/components/ui-global/Topbar/utils.ts
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';

// ─── Colour tokens ────────────────────────────────────────────────────────────

const NAV_BG = '#5E5E5E';
const SELECTED_NAV_ITEM_BG = '#2A2A2A';
const WHITE = '#ffffff';
const DARK_GRAY_TEXT = '#344054';
const MENU_ITEM_HOVER_BG = '#D0D5DD';
const MENU_ITEM_SELECTED_BG = '#EFF4FF';
const NAV_ITEM_HOVER_BG = 'rgba(255, 255, 255, 0.08)';
const BADGE_RED = '#D92D20';
const AI_GRADIENT_START = '#F7B5F0';
const AI_GRADIENT_END = '#C98BF5';
const NOTIFICATION_COUNT = 15;

// ─── Styles ───────────────────────────────────────────────────────────────────

const Styles = {
  selectedApp: {
    py: 1,
    px: 2,
    mr: 1.5,
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '24px',
    whiteSpace: 'nowrap',
    backgroundColor: SELECTED_NAV_ITEM_BG,
    color: WHITE,
    borderRadius: '8px',
    cursor: 'pointer',
  },
  app: {
    py: 1,
    px: 2,
    mr: 1.5,
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '24px',
    whiteSpace: 'nowrap',
    borderRadius: '8px',
    cursor: 'pointer',
    color: WHITE,
    '&:hover': { backgroundColor: NAV_ITEM_HOVER_BG },
  },
  navChevron: {
    pl: 1,
    fontSize: '22px',
    boxSizing: 'content-box',
  },
  iconButton: {
    p: 1,
    '&:hover': { backgroundColor: NAV_ITEM_HOVER_BG },
  },
  notificationBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: BADGE_RED,
      color: WHITE,
      fontSize: '12px',
      fontWeight: 600,
      minWidth: '22px',
      height: '22px',
      borderRadius: '11px',
      px: 0.75,
      top: 2,
      right: 2,
    },
  },
  dropdownMenuItem: {
    mx: 1,
    borderRadius: 1,
    color: DARK_GRAY_TEXT,
    fontWeight: 500,
    py: 2.5,
    '&:hover': { backgroundColor: MENU_ITEM_HOVER_BG },
    '&.Mui-selected': { backgroundColor: MENU_ITEM_HOVER_BG },
    '&.Mui-focusVisible': { backgroundColor: MENU_ITEM_HOVER_BG },
  },
  selectedDropdownMenuItem: {
    mx: 1,
    borderRadius: 1,
    color: DARK_GRAY_TEXT,
    fontWeight: 500,
    py: 2.5,
    backgroundColor: MENU_ITEM_SELECTED_BG,
    '&:hover': { backgroundColor: MENU_ITEM_HOVER_BG },
  },
  userProfileMenuItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    px: 1,
  },
  userProfileMenuItemMain: {
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid var(--Gray-200, #EAECF0)',
    alignSelf: 'stretch',
    width: '100%',
    py: 1.5,
    px: 1.5,
    '&:hover': { backgroundColor: MENU_ITEM_HOVER_BG, borderRadius: '6px' },
  },
  userProfileMenuItemIn: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },
  userProfileDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: '1 1 auto',
    minWidth: 0,
  },
  userProfileName: {
    color: 'var(--Gray-700, #344054)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: '20px',
  },
  userProfileEmail: {
    color: 'var(--Gray-600, #475467)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '20px',
  },
  userProfileLogOut: {
    display: 'flex',
    padding: '8px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  },
  overflowMenuButton: {
    py: 1,
    px: 2,
    mr: 1.5,
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '24px',
    whiteSpace: 'nowrap',
    borderRadius: '8px',
    cursor: 'pointer',
    color: WHITE,
    display: 'flex',
    alignItems: 'center',
    '&:hover': { backgroundColor: NAV_ITEM_HOVER_BG },
  },
  overflowMenuPaper: {
    borderRadius: '8px',
    minWidth: 'max-content',
    px: 1,
  },
  overflowMenuItemsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
  },
  overflowMenuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '176px',
    py: 1.5,
    px: 2,
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxSizing: 'border-box',
    '&:hover': { backgroundColor: MENU_ITEM_HOVER_BG },
  },
  overflowMenuItemText: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#1D2939',
  },
  overflowMenuItemIconButton: { p: 0 },
  overflowMenuItemChevronIcon: {
    fontSize: '20px',
    color: '#98A2B3',
  },
  overflowSubMenu: { left: 16 },
  overflowSubMenuPaper: {
    borderRadius: '8px',
    px: 1,
    '& .MuiList-root': {
      display: 'flex',
      flexDirection: 'column',
      gap: 0.5,
    },
  },
  overflowSubMenuItem: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#1D2939',
    borderRadius: '8px',
    py: 1.5,
    '&:hover': { backgroundColor: MENU_ITEM_HOVER_BG },
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavSubSubItem {
  condition: boolean;
  link: string;
  title: string;
  overrideLink?: string;
}

interface NavSubItem {
  condition: boolean;
  link: string;
  title: string;
  overrideLink?: string;
  displayInTopbar?: boolean;
  subMenuItems?: NavSubSubItem[];
}

interface NavItem {
  condition: boolean;
  link: string;
  title: string;
  icon: boolean;
  overrideLink?: string;
  subMenuItems?: NavSubItem[];
  /** Always listed under "More", never in the bar itself. */
  inMore?: boolean;
}

// ─── Hardcoded nav data (from pages.ts — all conditions true) ─────────────────
// Bar order: Time · Expenses · Pay · Scheduler · Resources · Reports · Documents · HR · Performance · More
// Items flagged `inMore` (Messages, Credential management, Forms) live only in the "More" menu.

const ALL_MENU_ITEMS: NavItem[] = [
  {
    condition: true,
    link: 'timesheet',
    title: 'Time',
    icon: true,
    subMenuItems: [
      { condition: true, link: 'weekly', title: 'Timesheets', overrideLink: '' },
      { condition: true, link: 'overview', title: 'Timesheet overview' },
      { condition: true, link: 'holiday', title: 'Holiday config' },
      { condition: true, link: 'timeoff', title: 'Time off requests' },
      { condition: true, link: 'payout_request', title: 'Payout requests' },
      { condition: true, link: 'equipment', title: 'Equipment timesheets' },
    ],
  },
  {
    condition: true,
    link: 'expenses',
    title: 'Expenses',
    icon: true,
  },
  {
    condition: true,
    link: 'payroll',
    title: 'Pay',
    icon: true,
    subMenuItems: [
      { condition: true, link: 'view', title: 'Payroll validation' },
      { condition: true, link: 'overview', title: 'Payroll overview' },
      { condition: true, link: 'drafts', title: 'Payroll drafts' },
      { condition: true, link: 'history', title: 'Payroll history' },
      { condition: true, link: 'manage', title: 'Company info' },
      { condition: true, link: 'workforceJunctionBenefit', title: 'Benefits' },
    ],
  },
  {
    condition: true,
    link: 'scheduler',
    title: 'Scheduler',
    icon: true,
    subMenuItems: [
      { condition: true, link: 'projects', title: 'Project' },
      { condition: true, link: 'serviceorders', title: 'Service order' },
    ],
  },
  {
    condition: true,
    link: 'resources',
    title: 'Resources',
    icon: true,
    subMenuItems: [
      {
        condition: true,
        link: 'users',
        title: 'Users',
        subMenuItems: [
          {
            condition: true,
            link: 'onboarding',
            title: 'Onboarding users',
            overrideLink: 'resources/users/onboarding',
          },
          {
            condition: true,
            link: 'active',
            title: 'Active users',
            overrideLink: 'resources/users/active',
          },
        ],
      },
      { condition: true, link: 'map', title: 'Map' },
      { condition: true, link: 'equipment', title: 'Equipment' },
    ],
  },
  {
    condition: true,
    link: 'reports',
    title: 'Reports',
    icon: true,
  },
  {
    condition: true,
    link: 'documents',
    title: 'Documents',
    icon: true,
    subMenuItems: [
      { condition: true, link: 'project', title: 'Project' },
      { condition: true, link: 'payroll', title: 'Payroll' },
      { condition: true, link: 'onboarding', title: 'Onboarding' },
      { condition: true, link: 'data_vault', title: 'Data vault' },
    ],
  },
  {
    condition: true,
    link: 'hr',
    title: 'HR',
    icon: true,
    subMenuItems: [
      { condition: true, link: 'hiring', title: 'Hiring' },
      { condition: true, link: 'onboarding', title: 'Onboarding' },
      { condition: true, link: 'lumber_onboarding', title: 'Templates' },
      { condition: true, link: 'hr_onboarding', title: 'HR onboarding' },
      { condition: true, link: 'benefit_admin', title: 'Benefits eligibility grouping' },
      { condition: true, link: 'benefit_admin_console', title: 'SSO to benefits junction' },
    ],
  },
  {
    // One version of the Performance tab per role; each opens its own tab list.
    condition: true,
    link: 'performance',
    title: 'Performance',
    icon: true,
    subMenuItems: [
      {
        condition: true,
        link: 'admin',
        title: 'HR Admin',
        subMenuItems: [
          { condition: true, link: 'overview', title: 'Overview', overrideLink: 'performance/admin/overview' },
          { condition: true, link: 'cycles', title: 'Review cycles', overrideLink: 'performance/admin/cycles' },
          { condition: true, link: 'automatic', title: 'Automatic reviews', overrideLink: 'performance/admin/automatic' },
          { condition: true, link: 'templates', title: 'Templates', overrideLink: 'performance/admin/templates' },
          { condition: true, link: 'settings', title: 'Performance settings', overrideLink: 'performance/admin/settings' },
        ],
      },
      {
        condition: true,
        link: 'superintendent',
        title: 'Superintendent',
        subMenuItems: [
          { condition: true, link: 'overview', title: 'Overview', overrideLink: 'performance/superintendent/overview' },
          { condition: true, link: 'crews', title: 'Crews', overrideLink: 'performance/superintendent/crews' },
          { condition: true, link: 'outliers', title: 'Outlier check', overrideLink: 'performance/superintendent/outliers' },
        ],
      },
      {
        condition: true,
        link: 'foreman',
        title: 'Foreman',
        subMenuItems: [
          { condition: true, link: 'overview', title: 'Overview', overrideLink: 'performance/foreman/overview' },
          { condition: true, link: 'crew', title: 'Crew review', overrideLink: 'performance/foreman/crew' },
          { condition: true, link: 'reviews', title: 'All my reviews', overrideLink: 'performance/foreman/reviews' },
        ],
      },
      {
        condition: true,
        link: 'worker',
        title: 'Worker',
        subMenuItems: [
          { condition: true, link: 'checkin', title: 'My check-in', overrideLink: 'performance/worker/checkin' },
        ],
      },
    ],
  },
  {
    condition: true,
    link: 'messaging',
    title: 'Messages',
    icon: false,
    inMore: true,
  },
  {
    condition: true,
    link: 'builderfax',
    title: 'Credential management',
    icon: true,
    overrideLink: 'builderfax/compliance',
    inMore: true,
  },
  {
    condition: true,
    link: 'forms',
    title: 'Forms',
    icon: true,
    inMore: true,
  },
];

const BAR_ITEMS = ALL_MENU_ITEMS.filter((item) => !item.inMore);
const MORE_ONLY_ITEMS = ALL_MENU_ITEMS.filter((item) => item.inMore);
const PINNED_LINK = 'performance';

const STATIC_USER = {
  name: 'Alex Johnson',
  email: 'alex.johnson@company.com',
};

// ─── Utility (from utils.ts) ──────────────────────────────────────────────────

const getNavigationLink = (item: NavItem, subItem: NavSubItem): string => {
  if (subItem.overrideLink !== undefined && subItem.overrideLink !== null) {
    return subItem.overrideLink === '' ? item.link : subItem.overrideLink;
  }
  return `${item.link}/${subItem.link}`;
};

// ─── Lumber icon mark — inlined from public/icon.svg, scaled to 28px ─────────

const LumberIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 1401 1401"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Lumber"
  >
    <path d="M100.384 574.978C133.458 575.069 166.532 575.159 199.697 575.25C213.615 575.25 227.449 575.25 241.371 575.25C244.208 575.25 247.046 575.25 250.771 575.25C247.842 586.817 245.096 596.923 242.877 607.122C230.021 665.312 227.096 723.865 234.365 783.146C239.599 825.49 249.974 866.38 265.136 905.9C283.135 952.617 307.697 995.506 338.29 1034.84C355.136 1056.43 373.492 1076.46 393.442 1094.95C417.385 1117.07 443.275 1136.47 470.852 1153.59C503.926 1174.08 538.775 1190.11 575.487 1201.94C605.898 1211.78 636.935 1219.25 668.856 1222.07C681.537 1223.16 694.218 1223.62 706.895 1224.53C756.197 1228.08 805.499 1225.71 854.801 1226.08C912.968 1226.53 971.226 1226.17 1029.48 1226.17C1032.67 1226.17 1035.78 1226.17 1038.97 1226.17C1039.24 1226.71 1039.5 1227.35 1039.77 1227.9C1037.37 1229.72 1035.16 1231.91 1032.5 1233.18C1006.69 1245.84 980.713 1258.13 952.517 1264.14C938.152 1267.24 923.608 1269.79 909.243 1272.79C886.1 1277.53 863.313 1283.35 841.145 1291.92C834.051 1294.65 826.248 1295.47 818.799 1297.29C815.696 1298.11 812.771 1299.38 809.755 1300.39C802.662 1300.39 795.568 1300.39 788.474 1300.39C785.193 1299.38 781.912 1297.65 778.543 1297.38C761.075 1295.74 743.694 1297.47 726.404 1300.39C721.083 1300.39 715.764 1300.39 710.442 1300.39C708.405 1300.02 706.452 1299.38 704.414 1299.2C680.296 1296.92 656.175 1295.1 632.148 1292.28C606.876 1289.37 582.136 1283.63 557.84 1276.16C549.062 1273.43 540.991 1272.7 532.125 1275.8C514.126 1282.08 497.542 1277.98 483.533 1265.14C477.502 1259.59 472.361 1252.76 467.396 1246.02C463.758 1241.01 459.502 1237.37 454.271 1234.27C436.094 1223.71 418.094 1212.78 400.182 1201.67C388.832 1194.57 378.192 1186.56 366.842 1179.36C358.861 1174.26 350.258 1170.26 342.102 1165.34C313.019 1147.95 286.06 1127.36 259.195 1106.69C254.67 1103.23 250.858 1097.95 248.642 1092.58C243.764 1081.01 240.218 1068.81 235.874 1056.97C229.665 1040.4 224.168 1023.37 213.971 1008.71C203.684 993.776 196.503 977.292 190.741 960.174C188.435 953.343 187.46 946.058 186.041 938.955C184.797 932.765 184.266 926.391 182.494 920.47C177.969 905.171 172.473 890.145 168.129 874.757C165.91 866.834 162.364 860.55 156.336 855.18C150.395 849.806 144.455 844.251 139.577 837.877C128.758 823.67 123.88 806.914 121.752 789.249C119.358 769.762 117.321 750.273 114.571 730.877C111.024 706.108 107.034 681.43 103.131 656.751C102.778 654.75 101.446 653.02 100.562 651.196C100.562 649.376 100.562 647.556 100.562 645.735C104.906 639.905 103.309 632.986 104.018 626.518C104.818 619.324 104.549 611.858 106.237 604.936C108.096 597.379 105.615 592.281 100.562 587.546C100.384 583.448 100.384 579.257 100.384 574.978Z" fill="#7AECB4"/>
    <path d="M1184.13 866.649C1186.26 857.36 1187.85 849.437 1189.98 841.605C1198.85 808.097 1202.93 773.856 1204.35 739.344C1206.3 691.536 1201.33 644.456 1190.07 598.014C1181.11 560.768 1168.44 525.07 1151.41 491.106C1133.76 455.683 1112.48 422.716 1087.21 392.486C1055.11 353.964 1018.49 320.909 976.903 293.682C936.648 267.273 893.553 247.24 847.532 233.762C817.652 224.929 787.237 219.193 756.378 216.096C740.594 214.457 724.635 213.456 708.761 213.456C610.335 213.181 512.001 213.362 413.575 213.366C410.028 213.366 406.482 213.362 401.694 213.362C406.216 208.63 411.269 207.717 415.969 206.444C432.462 201.98 448.865 197.245 465.536 193.329C479.901 189.96 492.404 182.948 504.551 174.753C519.891 164.372 536.119 157.268 555.184 159.455C561.746 160.183 567.596 158.178 572.561 152.533C581.43 142.427 592.78 135.871 605.37 131.864C618.316 127.764 631.35 124.304 644.388 120.57C661.943 115.562 679.59 110.736 697.236 105.728C715.679 100.445 734.301 97.5335 752.919 104.452C760.016 107.095 766.665 111.374 773.403 115.015C782.449 119.935 792.024 122.756 802.221 122.575C811.62 122.393 821.108 121.208 830.507 121.389C839.02 121.483 847.532 122.575 855.957 123.666C865 124.761 874.047 126.763 883.09 127.492C887.968 127.858 893.2 127.401 897.721 125.762C914.746 119.75 930.264 121.937 944.451 133.319C972.029 155.448 999.606 177.668 1027.18 199.888C1031.88 203.619 1036.76 206.897 1042.88 207.626C1057.95 209.54 1069.74 217.463 1079.85 228.845C1100.07 251.7 1120.73 274.101 1140.95 297.05C1153 310.709 1162.23 326.101 1164.53 344.859C1165.51 352.781 1169.15 359.247 1174.2 364.892C1184.04 375.73 1193.62 386.84 1204.17 396.946C1213.83 406.236 1221.55 416.526 1227.05 428.818C1237.87 452.949 1248.77 477.081 1259.5 501.306C1268.19 521.064 1270.5 542.102 1269.96 563.408C1269.61 577.07 1273.86 589.635 1276.35 602.659C1276.7 604.57 1278.03 606.666 1279.54 607.939C1294.97 620.14 1297.99 637.443 1298.25 655.838C1298.43 666.767 1298.16 677.692 1298.34 688.53C1298.52 704.557 1298.96 720.674 1299.31 736.701C1299.67 754.914 1296.48 772.127 1286.37 787.697C1284.5 790.612 1283.71 794.344 1282.82 797.715C1281.49 803.176 1282.91 807.183 1287.96 810.736C1296.12 816.563 1300.55 825.306 1300.38 835.596C1300.2 844.066 1299.14 852.443 1298.07 860.822C1297.36 866.283 1295.94 867.103 1289.29 867.103C1270.67 867.193 1252.05 867.103 1233.43 867.103C1220.13 867.103 1206.83 867.103 1193.53 867.103C1190.69 866.649 1187.85 866.649 1184.13 866.649Z" fill="#7AECB4"/>
    <path d="M202.981 355.143C207.503 351.502 212.112 347.949 216.546 344.127C226.39 335.566 236.143 326.642 246.074 318.081C259.02 306.971 273.651 300.872 290.941 303.237C303.888 305.06 314.972 300.415 324.106 291.583C328.806 287.028 333.681 286.484 339.446 286.484C464.474 286.575 589.411 287.119 714.436 286.3C781.206 285.846 843.632 302.327 902.952 332.288C933.72 347.858 961.742 367.982 987.9 390.931C1034.36 431.818 1070.19 480.903 1096.08 537.544C1112.04 572.51 1123.03 609.299 1129.07 647.455C1140.06 716.846 1135.63 785.051 1114.88 852.164C1113.46 856.718 1111.68 861.182 1110 866.099C1084.91 866.099 1060.26 866.099 1034.36 866.099C1037.02 858.629 1039.33 851.892 1041.81 845.245C1053.43 814.283 1060.61 782.139 1062.83 749.172C1066.02 702.001 1061.85 655.559 1047.31 610.303C1036.31 575.882 1021.42 543.462 1001.02 513.957C977.882 480.355 950.214 451.489 917.671 427.176C877.681 397.215 833.436 377.729 785.462 366.528C764.181 361.517 742.457 358.877 720.467 358.787C672.584 358.515 624.792 357.786 576.908 357.695C456.049 357.51 335.19 357.601 214.331 357.601C210.872 357.601 207.325 357.601 203.869 357.601C203.512 356.691 203.247 355.871 202.981 355.143Z" fill="#7AECB4"/>
    <path d="M387.854 575.253C386.879 578.712 386.526 581.08 385.639 583.266C378.014 602.299 371.805 621.876 367.549 642C360.546 675.33 357.974 709.023 360.102 743.082C363.471 797.537 378.28 848.533 404.26 895.885C424.035 931.945 448.949 963.908 479.721 991.045C500.201 1009.08 521.926 1025.01 545.691 1038.03C573.887 1053.51 603.592 1064.62 634.807 1072C660.253 1078.01 685.968 1080.65 712.127 1080.65C830.326 1080.83 948.436 1081.29 1066.64 1081.56C1106.18 1081.65 1145.82 1081.56 1185.37 1081.56C1188.29 1081.56 1191.13 1081.56 1195.92 1081.56C1194.24 1084.93 1193.61 1087.3 1192.19 1088.66C1176.06 1104.15 1159.74 1119.44 1143.42 1134.74C1138.19 1139.66 1132.87 1144.49 1127.2 1148.76C1124.54 1150.77 1120.9 1151.59 1117.53 1152.32C1114.96 1152.87 1112.21 1152.41 1109.55 1152.41C984.26 1152.41 859.057 1152.41 733.764 1152.41C715.495 1152.41 697.143 1153.05 678.874 1152.23C650.147 1150.86 622.126 1144.94 594.461 1136.74C543.384 1121.63 496.832 1097.68 454.624 1064.44C409.847 1029.2 373.048 986.582 344.849 936.499C314.7 883.045 296.613 825.493 290.407 764.116C284.288 703.377 290.673 643.824 308.76 585.634C309.294 583.905 309.913 582.175 310.356 580.442C311.422 576.892 313.459 575.072 317.45 575.162C340.506 575.344 363.558 575.253 387.854 575.253Z" fill="#7AECB4"/>
    <path d="M868.016 866.014C873.604 858.273 878.3 851.717 883.091 845.252C900.468 822.031 911.199 795.623 917.405 767.391C930.883 705.561 919.712 648.009 884.862 596.012C854.804 551.119 813.039 522.524 761.431 509.228C739.798 503.582 717.717 501.762 695.549 501.762C510.226 501.671 324.99 501.671 139.667 501.671C135.855 501.671 132.13 501.671 128.318 501.671C128.318 490.195 128.139 479.633 128.408 469.07C128.761 454.501 136.121 443.3 145.786 433.466C146.852 432.371 148.714 431.733 150.308 431.552C152.614 431.189 155.008 431.461 157.401 431.461C337.049 431.461 516.701 431.461 696.436 431.461C710.536 431.461 724.632 428.637 738.823 431.371C755.582 434.649 772.781 436.378 789.187 441.204C827.048 452.224 861.541 470.618 891.781 496.754C924.055 524.62 949.683 557.856 967.504 597.195C979.388 623.421 987.457 650.924 991.181 679.606C995.525 712.298 994.55 744.808 988.078 777.228C982.313 805.91 972.469 832.956 959.17 858.82C956.332 864.375 953.051 866.743 946.845 866.649C923.171 866.286 899.584 866.558 875.907 866.468C873.691 866.558 871.385 866.286 868.016 866.014Z" fill="#7AECB4"/>
    <path d="M552.965 575.979C548.356 582.353 544.809 587.451 541.084 592.553C518.563 623.331 505.439 658.118 501.714 696.09C496.483 749.453 508.01 799.082 538.334 843.156C573.627 894.515 622.22 924.385 682.515 934.219C695.018 936.221 707.786 937.044 720.467 937.044C905.081 937.225 1089.69 937.134 1274.4 937.134C1278.21 937.134 1282.02 937.134 1287.25 937.134C1285.75 943.781 1284.6 949.517 1283 955.163C1278.21 972.1 1270.85 987.855 1261.1 1002.51C1258.44 1006.52 1255.42 1008.35 1250.81 1007.8C1248.51 1007.53 1246.11 1007.8 1243.72 1007.8C1072.4 1007.8 901.003 1007.71 729.689 1007.89C716.477 1007.89 703.264 1008.98 689.965 1008.16C665.312 1006.52 641.551 1000.97 618.317 992.681C571.852 976.107 532.66 948.607 500.117 910.998C470.146 876.395 449.574 836.691 438.403 791.979C425.103 739.163 426.697 686.437 441.862 634.259C447.268 615.683 454.806 597.923 464.027 580.896C466.158 576.98 468.552 575.159 472.983 575.159C498.079 575.341 523.172 575.25 548.356 575.25C549.244 575.25 550.306 575.522 552.965 575.979Z" fill="#7AECB4"/>
    <path d="M852.763 719.861C852.851 801.544 787.059 864.922 711.155 864.56C634.454 864.194 570.521 800.724 570.255 719.952C569.99 639.179 635.785 571.062 718.692 574.978C789.453 578.35 852.851 638.722 852.763 719.861ZM781.381 719.767C782.181 677.332 746.269 646.827 710.623 647.555C673.115 648.375 641.813 680.429 641.282 718.948C640.75 759.109 674.443 791.435 711.067 791.707C745.826 791.891 782.181 762.477 781.381 719.767Z" fill="#7AECB4"/>
  </svg>
);

// ─── LumberAI sparkle — AutoAwesome glyph with a pink → violet gradient ───────

const LumberAIIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="lumber-ai-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={AI_GRADIENT_START} />
        <stop offset="100%" stopColor={AI_GRADIENT_END} />
      </linearGradient>
    </defs>
    <path
      fill="url(#lumber-ai-gradient)"
      d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"
    />
  </svg>
);

// ─── NavbarItem ───────────────────────────────────────────────────────────────

interface NavbarItemProps {
  item: NavItem;
  selectedApp: string;
  selectedChildApp: string;
  onNavigate: (path: string) => void;
}

const NavbarItem = ({ item, selectedApp, selectedChildApp, onNavigate }: NavbarItemProps) => {
  const { condition, subMenuItems, title, link } = item;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [nestedAnchorEl, setNestedAnchorEl] = useState<null | HTMLElement>(null);
  const [nestedParent, setNestedParent] = useState<NavSubItem | null>(null);

  if (!condition) return null;

  const hasChildren = Boolean(subMenuItems && subMenuItems.length > 0);

  const allChildrenFalse = subMenuItems
    ? subMenuItems.some((s) => s.condition && s.displayInTopbar !== false)
    : true;

  const isSelected = !allChildrenFalse
    ? link === `${selectedApp}/${selectedChildApp}`
    : link === selectedApp;

  return (
    <>
      <Box
        sx={isSelected ? Styles.selectedApp : Styles.app}
        onClick={(e) => {
          if (hasChildren) {
            setAnchorEl(e.currentTarget);
          } else {
            onNavigate(`/${item.overrideLink ?? link}`);
            setAnchorEl(null);
          }
        }}
        data-testid={`nav-${link}-menu`}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box>{title}</Box>
          {hasChildren && (
            Boolean(anchorEl)
              ? <KeyboardArrowUpIcon sx={Styles.navChevron} />
              : <KeyboardArrowDownIcon sx={Styles.navChevron} />
          )}
        </Box>
      </Box>

      {hasChildren && (
        <Menu
          slotProps={{ paper: { sx: { borderRadius: '8px', minWidth: '120px' } }, list: { sx: { py: 2, px: 1 } } }}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => {
            setAnchorEl(null);
            setNestedAnchorEl(null);
            setNestedParent(null);
          }}
          autoFocus={false}
        >
          {subMenuItems?.map((subItem) => {
            if (!subItem.condition || subItem.displayInTopbar === false) return null;
            const subItemHasChildren = Boolean(
              subItem.subMenuItems && subItem.subMenuItems.length > 0
            );
            return (
              <MenuItem
                selected={false}
                sx={
                  link === selectedApp &&
                  (selectedChildApp === subItem.link ||
                    (subItem.overrideLink === '' && selectedChildApp === ''))
                    ? Styles.selectedDropdownMenuItem
                    : Styles.dropdownMenuItem
                }
                key={subItem.link}
                onClick={(e) => {
                  if (subItemHasChildren) {
                    e.stopPropagation();
                    return;
                  }
                  setAnchorEl(null);
                  setNestedAnchorEl(null);
                  setNestedParent(null);
                  const navLink =
                    subItem.overrideLink !== undefined && subItem.overrideLink !== null
                      ? (subItem.overrideLink === '' ? link : subItem.overrideLink)
                      : `${link}/${subItem.link}`;
                  onNavigate(`/${navLink}`);
                }}
                onMouseEnter={(e) => {
                  if (!subItemHasChildren) {
                    setNestedAnchorEl(null);
                    setNestedParent(null);
                    return;
                  }
                  setNestedAnchorEl(e.currentTarget);
                  setNestedParent(subItem);
                }}
                onMouseLeave={() => {
                  if (subItemHasChildren) return;
                  setNestedAnchorEl(null);
                  setNestedParent(null);
                }}
                data-testid={`nav-${link}-${subItem.link}`}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    lineHeight: 1,
                  }}
                >
                  <Box>{subItem.title}</Box>
                  {subItemHasChildren && (
                    <ChevronRightIcon
                      sx={{ fontSize: '20px', color: DARK_GRAY_TEXT, position: 'relative', top: '1px' }}
                    />
                  )}
                </Box>
              </MenuItem>
            );
          })}
        </Menu>
      )}

      {nestedParent?.subMenuItems && nestedParent.subMenuItems.length > 0 && (
        <Menu
          slotProps={{ paper: { sx: { borderRadius: '8px', minWidth: '160px' } } }}
          anchorEl={nestedAnchorEl}
          open={Boolean(nestedAnchorEl)}
          onClose={() => {
            setNestedAnchorEl(null);
            setNestedParent(null);
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          MenuListProps={{
            onMouseLeave: () => {
              setNestedAnchorEl(null);
              setNestedParent(null);
            },
          }}
          autoFocus={false}
        >
          {nestedParent.subMenuItems.map((nestedItem) => {
            if (!nestedItem.condition) return null;
            return (
              <MenuItem
                key={nestedItem.link}
                sx={Styles.dropdownMenuItem}
                onClick={() => {
                  setNestedAnchorEl(null);
                  setNestedParent(null);
                  setAnchorEl(null);
                  const navLink =
                    nestedItem.overrideLink !== undefined && nestedItem.overrideLink !== null
                      ? nestedItem.overrideLink
                      : `${link}/${nestedParent.link}/${nestedItem.link}`;
                  onNavigate(`/${navLink}`);
                }}
                data-testid={`nav-${link}-${nestedParent.link}-${nestedItem.link}`}
              >
                {nestedItem.title}
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </>
  );
};

// ─── NavbarMenuOverflowItem ───────────────────────────────────────────────────

interface NavbarMenuOverflowItemProps {
  item: NavItem;
  handleClickNavbarItem: (item: NavItem, subItem: NavSubItem | null) => void;
}

const NavbarMenuOverflowItem = ({ item, handleClickNavbarItem }: NavbarMenuOverflowItemProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const hasSubMenu = Boolean(item.subMenuItems && item.subMenuItems.length > 0);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (hasSubMenu) {
      setAnchorEl(event.currentTarget);
    } else {
      handleClickNavbarItem(item, null);
    }
  };

  return (
    <>
      <MenuItem sx={Styles.overflowMenuItem} onClick={handleClick}>
        <Typography sx={Styles.overflowMenuItemText}>{item.title}</Typography>
        {hasSubMenu && (
          <IconButton sx={Styles.overflowMenuItemIconButton}>
            <ChevronRightIcon sx={Styles.overflowMenuItemChevronIcon} />
          </IconButton>
        )}
      </MenuItem>
      {hasSubMenu && (
        <Menu
          open={openMenu}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={Styles.overflowSubMenu}
          slotProps={{ paper: { sx: Styles.overflowSubMenuPaper } }}
        >
          {item.subMenuItems
            ?.filter((s) => s.condition && s.displayInTopbar !== false)
            .map((subItem) => (
              <MenuItem
                sx={Styles.overflowSubMenuItem}
                key={subItem.link}
                onClick={() => {
                  setAnchorEl(null);
                  handleClickNavbarItem(item, subItem);
                }}
              >
                {subItem.title}
              </MenuItem>
            ))}
        </Menu>
      )}
    </>
  );
};

// ─── Topbar ───────────────────────────────────────────────────────────────────

const Topbar = () => {
  const theme = useTheme();
  // Widths at which the bar is known to fit (logo + tabs + right-hand icons).
  const fitsAll = useMediaQuery('(min-width:1680px)');
  const fitsSeven = useMediaQuery('(min-width:1440px)');
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [selectedApp, setSelectedApp] = useState('performance');
  const [selectedChildApp, setSelectedChildApp] = useState('admin');

  const [userMenu, setUserMenu] = useState<null | HTMLElement>(null);
  const [overflowAnchor, setOverflowAnchor] = useState<null | HTMLElement>(null);

  const openUserMenu = Boolean(userMenu);
  const openOverflowMenu = Boolean(overflowAnchor);

  const PRIMARY_COUNT = fitsAll
    ? BAR_ITEMS.length
    : fitsSeven
    ? 7
    : isLgUp
    ? 5
    : isMdUp
    ? 3
    : 2;

  // Performance is pinned: it stays in the bar at every breakpoint.
  const visibleMenuItems = useMemo(() => {
    const head = BAR_ITEMS.slice(0, PRIMARY_COUNT);
    if (head.some((item) => item.link === PINNED_LINK)) return head;
    const pinned = BAR_ITEMS.find((item) => item.link === PINNED_LINK);
    return pinned ? [...head.slice(0, Math.max(0, PRIMARY_COUNT - 1)), pinned] : head;
  }, [PRIMARY_COUNT]);

  const overflowMenuItems = useMemo(() => {
    const raw = [
      ...BAR_ITEMS.filter((item) => !visibleMenuItems.includes(item)),
      ...MORE_ONLY_ITEMS,
    ];
    return raw.flatMap((item) => {
      if (item.link !== 'hr' || !item.subMenuItems?.length) return [item];
      const complianceSubs = item.subMenuItems.filter(
        (s) =>
          s.condition &&
          s.displayInTopbar !== false &&
          (s.link === 'compliance' || s.link === 'compliance_analytics')
      );
      const otherSubs = item.subMenuItems.filter(
        (s) =>
          s.condition &&
          s.displayInTopbar !== false &&
          s.link !== 'compliance' &&
          s.link !== 'compliance_analytics'
      );
      const result: NavItem[] = [];
      if (otherSubs.length > 0) result.push({ ...item, subMenuItems: otherSubs });
      complianceSubs.forEach((s) =>
        result.push({ condition: true, link: `hr/${s.link}`, title: s.title, icon: false })
      );
      return result;
    });
  }, [visibleMenuItems]);

  const handleNavigate = useCallback((path: string) => {
    const parts = path.replace(/^\//, '').split('/');
    setSelectedApp(parts[0] ?? '');
    setSelectedChildApp(parts[1] ?? '');
    console.log('Navigate to:', path);
  }, []);

  const handleClickNavbarItem = useCallback(
    (item: NavItem, subItem: NavSubItem | null) => {
      setOverflowAnchor(null);
      const navLink = subItem ? getNavigationLink(item, subItem) : (item.overrideLink ?? item.link);
      handleNavigate(`/${navLink}`);
    },
    [handleNavigate]
  );

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        background: NAV_BG,
        position: 'sticky',
        top: 0,
        pl: 3,
        pr: 3,
        height: '64px',
        fontFamily: 'Inter, sans-serif',
        boxSizing: 'border-box',
        zIndex: 1100,
      }}
    >
      <Box height="100%" width="100%" display="flex" alignItems="center" justifyContent="space-between">

        {/* Left — icon mark + wordmark + primary nav */}
        <Box display="flex" alignItems="center">
          <Box
            onClick={() => handleNavigate('/')}
            sx={{ cursor: 'pointer', mr: 1, display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <LumberIcon />
            <Typography
              sx={{
                color: WHITE,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                letterSpacing: '0.5px',
                lineHeight: 1,
                mr: 4,
              }}
            >
              LUMBER
            </Typography>
          </Box>

          <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
            {visibleMenuItems.map((item) => (
              <NavbarItem
                key={item.title}
                selectedChildApp={selectedChildApp}
                selectedApp={selectedApp}
                item={item}
                onNavigate={handleNavigate}
              />
            ))}

            {overflowMenuItems.length > 0 && (
              <>
                <Box
                  onClick={(e) => setOverflowAnchor(e.currentTarget)}
                  sx={Styles.overflowMenuButton}
                  data-testid="nav-more-menu"
                >
                  <Box>More</Box>
                  {openOverflowMenu
                    ? <KeyboardArrowUpIcon sx={Styles.navChevron} />
                    : <KeyboardArrowDownIcon sx={Styles.navChevron} />
                  }
                </Box>
                <Menu
                  anchorEl={overflowAnchor}
                  open={openOverflowMenu}
                  onClose={() => setOverflowAnchor(null)}
                  anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                  transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                  slotProps={{ paper: { sx: Styles.overflowMenuPaper } }}
                >
                  <Box sx={Styles.overflowMenuItemsContainer}>
                    {overflowMenuItems.map((item) => (
                      <NavbarMenuOverflowItem
                        key={item.title}
                        item={item}
                        handleClickNavbarItem={handleClickNavbarItem}
                      />
                    ))}
                  </Box>
                </Menu>
              </>
            )}
          </Box>
        </Box>

        {/* Right — AI, notifications, settings */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexShrink: 0 }}>
          <IconButton
            sx={Styles.iconButton}
            aria-label="Open LumberAI"
            onClick={() => console.log('LumberAI toggled')}
          >
            <LumberAIIcon />
          </IconButton>

          <IconButton sx={Styles.iconButton} aria-label={`Notifications (${NOTIFICATION_COUNT} unread)`}>
            <Badge badgeContent={NOTIFICATION_COUNT} max={99} overlap="circular" sx={Styles.notificationBadge}>
              <NotificationsIcon sx={{ color: WHITE, fontSize: '24px' }} />
            </Badge>
          </IconButton>

          <IconButton
            sx={Styles.iconButton}
            data-testid="settings-button"
            onClick={(e) => setUserMenu(e.currentTarget)}
            aria-label="Open settings menu"
          >
            <SettingsIcon sx={{ fontSize: '24px', color: WHITE }} />
          </IconButton>

          {/* Settings dropdown */}
          <Menu
            id="user-menu"
            anchorEl={userMenu}
            open={openUserMenu}
            onClose={() => setUserMenu(null)}
            slotProps={{ paper: { sx: { borderRadius: '8px' } }, list: { sx: { py: 2, px: 1 } } }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          >
            <Box>
              <MenuItem
                sx={selectedApp === 'onboarding' ? Styles.selectedDropdownMenuItem : Styles.dropdownMenuItem}
                onClick={() => { setUserMenu(null); handleNavigate('/onboarding'); }}
              >
                Implementation
              </MenuItem>
              <MenuItem
                sx={selectedApp === 'manage' ? Styles.selectedDropdownMenuItem : Styles.dropdownMenuItem}
                onClick={() => { setUserMenu(null); handleNavigate('/manage'); }}
              >
                Manage
              </MenuItem>
              <MenuItem
                data-testid="company-settings-menu-item"
                sx={selectedApp === 'settings' ? Styles.selectedDropdownMenuItem : Styles.dropdownMenuItem}
                onClick={() => { setUserMenu(null); handleNavigate('/settings'); }}
              >
                Company settings
              </MenuItem>
              <MenuItem
                sx={selectedApp === 'admin' ? Styles.selectedDropdownMenuItem : Styles.dropdownMenuItem}
                onClick={() => { setUserMenu(null); handleNavigate('/admin'); }}
              >
                Admin
              </MenuItem>
              <MenuItem
                sx={selectedApp === 'monitoring' ? Styles.selectedDropdownMenuItem : Styles.dropdownMenuItem}
                onClick={() => { setUserMenu(null); handleNavigate('/monitoring'); }}
              >
                Monitoring
              </MenuItem>
            </Box>

            {/* User profile + logout row */}
            <Box sx={Styles.userProfileMenuItem}>
              <MenuItem
                sx={Styles.userProfileMenuItemMain}
                onClick={() => { setUserMenu(null); console.log('Logout'); }}
              >
                <Box data-testid="user_logout" sx={Styles.userProfileMenuItemIn}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 0 0', mx: 2.5, py: 1 }}>
                    <Box sx={Styles.userProfileDetails}>
                      <Typography sx={Styles.userProfileName}>{STATIC_USER.name}</Typography>
                      <Typography sx={Styles.userProfileEmail}>{STATIC_USER.email}</Typography>
                    </Box>
                  </Box>
                  <Box sx={Styles.userProfileLogOut}>
                    <LogoutIcon sx={{ width: '20px', height: '20px', color: DARK_GRAY_TEXT }} />
                  </Box>
                </Box>
              </MenuItem>
            </Box>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
