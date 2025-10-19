import { checkAdmin } from "@/app/utils/checkAdmin";
import Link from "next/link";
import { 
  HiUsers, 
  HiFolder, 
  HiDocumentText, 
  HiChatBubbleLeftRight,
  HiChartBar,
  HiCog,
  HiShieldCheck
} from "react-icons/hi2";

export default async function AdminDashboard() {
  await checkAdmin();

  const stats = [
    { label: "Total Users", value: "1,234", change: "+12%", color: "blue" },
    { label: "Published Posts", value: "567", change: "+8%", color: "green" },
    { label: "Categories", value: "24", change: "+2", color: "purple" },
    { label: "Comments", value: "2,845", change: "+15%", color: "orange" },
  ];

  const quickActions = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      href: "/protected/admin/users",
      icon: HiUsers,
      color: "blue",
      count: "1,234"
    },
    {
      title: "Post Management",
      description: "Manage all blog posts and content",
      href: "/protected/admin/posts",
      icon: HiDocumentText,
      color: "green",
      count: "567"
    },
    {
      title: "Categories",
      description: "Organize content with categories",
      href: "/protected/admin/categories",
      icon: HiFolder,
      color: "purple",
      count: "24"
    },
    {
      title: "Comments",
      description: "Moderate and manage comments",
      href: "/protected/admin/comments",
      icon: HiChatBubbleLeftRight,
      color: "orange",
      count: "2,845"
    },
  ];

  const recentActivity = [
    { action: "New user registered", user: "john@example.com", time: "2 min ago" },
    { action: "Post published", user: "sarah@example.com", time: "15 min ago" },
    { action: "Comment reported", user: "mike@example.com", time: "1 hour ago" },
    { action: "Category created", user: "You", time: "2 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <HiShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600 mt-1">Welcome to your administration panel</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Admin Mode Active
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  {stat.color === 'blue' && <HiUsers className={`w-6 h-6 text-${stat.color}-600`} />}
                  {stat.color === 'green' && <HiDocumentText className={`w-6 h-6 text-${stat.color}-600`} />}
                  {stat.color === 'purple' && <HiFolder className={`w-6 h-6 text-${stat.color}-600`} />}
                  {stat.color === 'orange' && <HiChatBubbleLeftRight className={`w-6 h-6 text-${stat.color}-600`} />}
                </div>
                <span className={`text-sm font-medium text-${stat.color}-600 bg-${stat.color}-100 px-2 py-1 rounded-full`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-slate-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
                <Link 
                  href="/protected/admin/settings" 
                  className="text-slate-500 hover:text-slate-700 transition-colors duration-200 flex items-center text-sm"
                >
                  <HiCog className="w-4 h-4 mr-1" />
                  Settings
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="group p-6 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all duration-300 hover:border-slate-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{action.count}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors duration-200">
                      {action.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {action.description}
                    </p>
                    <div className="mt-4 flex items-center text-slate-500 text-sm group-hover:text-slate-700 transition-colors duration-200">
                      <span>Manage</span>
                      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity & System Status */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 text-sm font-medium">{activity.action}</p>
                      <p className="text-slate-500 text-xs">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors duration-200">
                View all activity
              </button>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">System Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Healthy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">API</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Storage</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">64% Used</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Uptime</span>
                  <span className="text-slate-700 text-sm font-medium">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Quick View */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Analytics Overview</h2>
            <Link 
              href="/protected/admin/analytics" 
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm"
            >
              <HiChartBar className="w-4 h-4 mr-1" />
              View Full Analytics
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-900 mb-1">12.4K</div>
              <div className="text-slate-600 text-sm">Page Views</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 mb-1">3.2K</div>
              <div className="text-slate-600 text-sm">Unique Visitors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 mb-1">2.1K</div>
              <div className="text-slate-600 text-sm">Engagements</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}