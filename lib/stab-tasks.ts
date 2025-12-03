/**
 * S.T.A.B Method Tasks for Google Ads Optimization
 *
 * S - Spending & Segmentation
 * T - Targeting
 * A - Ads & Landing Pages
 * B - Bidding
 */

import {
  BarChart3,
  Target,
  Sparkles,
  DollarSign,
  TrendingUp,
  Search,
  FileText,
  AlertTriangle,
  MapPin,
  Smartphone,
  Users,
  Clock,
  CheckCircle2,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type TaskStatus = "pending" | "in-progress" | "review" | "completed" | "blocked";

export interface STABTask {
  id: string;
  category: "spending" | "targeting" | "ads" | "bidding" | "quality";
  title: string;
  description: string;
  frequency: ("72hours" | "weekly" | "monthly" | "90days")[];
  icon: LucideIcon;
  subtasks: SubTask[];
  status?: TaskStatus;
  progress?: number; // 0-100
  lastRun?: Date;
  nextDue?: Date;
  priority?: "low" | "medium" | "high" | "urgent";
}

export interface SubTask {
  id: string;
  title: string;
  frequency: ("72hours" | "weekly" | "monthly" | "90days")[];
  notes?: string;
  status?: TaskStatus;
}

export const STAB_TASKS: STABTask[] = [
  // SPENDING & SEGMENTATION
  {
    id: "campaign-spend-review",
    category: "spending",
    title: "Campaign Spend vs Results",
    description: "Review campaign performance and identify optimization opportunities",
    frequency: ["weekly", "monthly"],
    icon: BarChart3,
    subtasks: [
      {
        id: "scale-ready-campaigns",
        title: "Identify campaigns ready to scale (good metrics, low impression share <65%)",
        frequency: ["monthly"],
      },
      {
        id: "campaigns-need-optimization",
        title: "Flag campaigns needing optimization (no conversions, high CPA, low ROAS)",
        frequency: ["weekly"],
      },
    ],
  },
  {
    id: "ad-group-spend-review",
    category: "spending",
    title: "Ad Group Spend vs Results",
    description: "Analyze ad group performance for campaign restructuring",
    frequency: ["weekly", "monthly"],
    icon: TrendingUp,
    subtasks: [
      {
        id: "separate-performing-ad-groups",
        title: "Move high-performing ad groups to separate campaigns",
        frequency: ["monthly"],
      },
      {
        id: "ad-groups-need-optimization",
        title: "Flag ad groups needing optimization (bad conversion metrics)",
        frequency: ["weekly"],
      },
    ],
  },

  // TARGETING
  {
    id: "search-term-audit",
    category: "targeting",
    title: "Search Term Audit",
    description: "Review search terms and optimize keyword targeting",
    frequency: ["72hours"],
    icon: Search,
    subtasks: [
      {
        id: "add-negative-keywords",
        title: "Add negative keywords to limit unrelated search terms",
        frequency: ["72hours"],
      },
      {
        id: "add-exact-match-keywords",
        title: "Add converting search terms as [exact match] keywords",
        frequency: ["72hours"],
      },
    ],
  },
  {
    id: "keyword-review",
    category: "targeting",
    title: "Keyword Performance Review",
    description: "Identify and optimize underperforming keywords",
    frequency: ["weekly"],
    icon: Target,
    subtasks: [
      {
        id: "high-cpc-keywords",
        title: "Review keywords with high CPC vs account average",
        frequency: ["weekly"],
      },
      {
        id: "high-cpa-keywords",
        title: "Review keywords with high cost per conversion",
        frequency: ["weekly"],
      },
      {
        id: "keyword-status-warnings",
        title: "Fix keywords with status warnings (low search volume, below first page bid)",
        frequency: ["weekly"],
      },
    ],
  },
  {
    id: "call-extensions-review",
    category: "targeting",
    title: "Call Extensions Analysis",
    description: "Review call extension performance for call-focused campaigns",
    frequency: ["weekly", "monthly"],
    icon: FileText,
    subtasks: [
      {
        id: "high-cpc-no-calls",
        title: "Identify high CPC keywords with no phone calls",
        frequency: ["monthly"],
      },
      {
        id: "quality-calls",
        title: "Find keywords driving highest quality phone calls",
        frequency: ["monthly"],
      },
    ],
  },
  {
    id: "auction-insights",
    category: "targeting",
    title: "Auction Insights Review",
    description: "Monitor competitive landscape and CPC changes",
    frequency: ["monthly"],
    icon: TrendingUp,
    subtasks: [
      {
        id: "new-competitors",
        title: "Check for new competitors or increased competitor spend",
        frequency: ["monthly"],
      },
    ],
  },
  {
    id: "keyword-quality-score",
    category: "targeting",
    title: "Keyword Quality Score Check",
    description: "Improve quality scores below 5/10",
    frequency: ["weekly", "monthly"],
    icon: AlertTriangle,
    subtasks: [
      {
        id: "low-quality-score",
        title: "Update ad copy for keywords with QS below 5/10",
        frequency: ["monthly"],
      },
      {
        id: "landing-page-updates",
        title: "Optimize landing pages for better keyword targeting",
        frequency: ["monthly"],
      },
      {
        id: "page-speed",
        title: "Review landing page load time (PageSpeed Insights)",
        frequency: ["monthly"],
      },
    ],
  },
  {
    id: "location-targeting",
    category: "targeting",
    title: "Location Performance",
    description: "Optimize location targeting and exclusions",
    frequency: ["monthly"],
    icon: MapPin,
    subtasks: [
      {
        id: "location-optimization",
        title: "Add location exclusions or bid adjustments",
        frequency: ["monthly"],
      },
      {
        id: "non-targeted-locations",
        title: "Exclude searches from non-targeted locations",
        frequency: ["monthly"],
      },
    ],
  },
  {
    id: "device-targeting",
    category: "targeting",
    title: "Device Performance",
    description: "Optimize device targeting and bids",
    frequency: ["monthly"],
    icon: Smartphone,
    subtasks: [
      {
        id: "device-optimization",
        title: "Add device exclusions or bid adjustments",
        frequency: ["monthly"],
      },
    ],
  },
  {
    id: "audience-performance",
    category: "targeting",
    title: "Audience Performance",
    description: "Review and optimize audience targeting",
    frequency: ["monthly"],
    icon: Users,
    subtasks: [
      {
        id: "audience-exclusions",
        title: "Add audience exclusions or bid optimizations",
        frequency: ["monthly"],
      },
      {
        id: "add-new-audiences",
        title: "Add new audiences if coverage is below 80%",
        frequency: ["monthly"],
      },
    ],
  },
  {
    id: "demographic-performance",
    category: "targeting",
    title: "Demographic Performance",
    description: "Optimize demographic targeting",
    frequency: ["90days"],
    icon: Users,
    subtasks: [
      {
        id: "age-demographics",
        title: "Review and optimize targeting by age",
        frequency: ["90days"],
      },
      {
        id: "income-demographics",
        title: "Review and optimize targeting by income (if available)",
        frequency: ["90days"],
      },
    ],
  },
  {
    id: "ad-schedule",
    category: "targeting",
    title: "Ad Schedule Performance",
    description: "Optimize when ads appear",
    frequency: ["90days"],
    icon: Clock,
    subtasks: [
      {
        id: "day-performance",
        title: "Review performance by day of week and exclude underperforming days",
        frequency: ["90days"],
      },
      {
        id: "hour-performance",
        title: "Review performance by hour and adjust budget/schedule",
        frequency: ["90days"],
      },
    ],
  },

  // ADS & LANDING PAGES
  {
    id: "ad-split-tests",
    category: "ads",
    title: "Ad Split Test Results",
    description: "Review and optimize ad copy performance",
    frequency: ["monthly"],
    icon: Sparkles,
    subtasks: [
      {
        id: "pause-losing-ads",
        title: "Pause ads with significantly lower CTR & conversion rate",
        frequency: ["monthly"],
      },
      {
        id: "create-new-tests",
        title: "Duplicate winning ad and create new split test",
        frequency: ["monthly"],
      },
    ],
  },
  {
    id: "ad-quality-check",
    category: "ads",
    title: "Ad Quality Check",
    description: "Ensure all ads are approved and showing",
    frequency: ["weekly"],
    icon: CheckCircle2,
    subtasks: [
      {
        id: "disapproved-ads",
        title: "Fix and resubmit disapproved or rarely shown ads",
        frequency: ["weekly"],
      },
    ],
  },
  {
    id: "ad-assets-review",
    category: "ads",
    title: "Ad Assets Review",
    description: "Review and update underperforming ad extensions",
    frequency: ["monthly"],
    icon: Zap,
    subtasks: [
      {
        id: "sitelink-extensions",
        title: "Update underperforming sitelink extensions",
        frequency: ["monthly"],
      },
      {
        id: "callout-extensions",
        title: "Update underperforming callout extensions",
        frequency: ["monthly"],
      },
      {
        id: "structured-snippet",
        title: "Update underperforming structured snippet extensions",
        frequency: ["monthly"],
      },
      {
        id: "call-extension",
        title: "Update underperforming call extensions",
        frequency: ["monthly"],
      },
      {
        id: "lead-form-extension",
        title: "Update underperforming lead form extensions",
        frequency: ["monthly"],
      },
      {
        id: "location-extensions",
        title: "Update underperforming location extensions",
        frequency: ["monthly"],
      },
      {
        id: "price-extension",
        title: "Update underperforming price extensions",
        frequency: ["monthly"],
      },
      {
        id: "promotion-extension",
        title: "Update underperforming promotion extensions",
        frequency: ["monthly"],
      },
      {
        id: "image-extensions",
        title: "Update underperforming image extensions",
        frequency: ["monthly"],
      },
    ],
  },
  {
    id: "landing-page-review",
    category: "ads",
    title: "Landing Page Review",
    description: "Optimize landing pages with low conversion rates",
    frequency: ["90days"],
    icon: FileText,
    subtasks: [
      {
        id: "low-converting-pages",
        title: "Update or change landing pages with significantly lower conversion rates",
        frequency: ["90days"],
      },
    ],
  },

  // BIDDING
  {
    id: "bidding-strategy-review",
    category: "bidding",
    title: "Campaign Bidding Review",
    description: "Evaluate and optimize bidding strategies",
    frequency: ["90days"],
    icon: DollarSign,
    subtasks: [
      {
        id: "switch-to-max-conversions",
        title: "Check if ready to switch to Max Conversions/Value (1+ conversion/day for 30 days)",
        frequency: ["90days"],
      },
      {
        id: "adjust-tcpa-troas",
        title: "Review tCPA/tROAS targets for performance optimization",
        frequency: ["monthly", "90days"],
      },
    ],
  },

  // QUALITY CONTROL
  {
    id: "quality-control",
    category: "quality",
    title: "Quality Control Checks",
    description: "Ensure account health and tracking",
    frequency: ["monthly"],
    icon: CheckCircle2,
    subtasks: [
      {
        id: "conversion-tracking",
        title: "Verify all conversion actions are working",
        frequency: ["monthly"],
      },
      {
        id: "budget-check",
        title: "Confirm budget is on track",
        frequency: ["monthly"],
      },
      {
        id: "payment-method",
        title: "Verify payment method is working",
        frequency: ["monthly"],
      },
      {
        id: "auto-apply-recommendations",
        title: "Review and disable unwanted auto-apply recommendations",
        frequency: ["monthly"],
      },
      {
        id: "google-notifications",
        title: "Action any notifications from Google",
        frequency: ["monthly"],
      },
    ],
  },
];

// Helper function to get tasks by frequency
export function getTasksByFrequency(frequency: "72hours" | "weekly" | "monthly" | "90days"): STABTask[] {
  return STAB_TASKS.filter(task => task.frequency.includes(frequency));
}

// Helper function to get tasks by category
export function getTasksByCategory(category: STABTask["category"]): STABTask[] {
  return STAB_TASKS.filter(task => task.category === category);
}
