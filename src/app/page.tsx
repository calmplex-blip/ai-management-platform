import { MetricCard } from '@/components/dashboard/MetricCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SystemHealth } from '@/components/dashboard/SystemHealth';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { MCPServersWidget } from '@/components/dashboard/MCPServersWidget';
import { A2AWidget } from '@/components/dashboard/A2AWidget';
import { AP2Widget } from '@/components/dashboard/AP2Widget';
import { SkinsWidget } from '@/components/dashboard/SkinsWidget';
import { Button } from '@/components/ui/Button';
import { ModelsIcon, LightningIcon, DollarIcon, ClockIcon } from '@/components/icons';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="p-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome back, Admin
          </h1>
          <p className="mt-1 text-gray-300 text-sm">
            Here&apos;s what&apos;s happening with your AI operations today
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Active Models"
            value={12}
            change="+2 this week"
            changeType="positive"
            icon={<ModelsIcon className="w-6 h-6" />}
          />
          <MetricCard
            title="API Requests"
            value="1.2M"
            change="+12.5% from last month"
            changeType="positive"
            icon={<LightningIcon className="w-6 h-6" />}
          />
          <MetricCard
            title="Monthly Cost"
            value="$4,234"
            change="-8.3% from last month"
            changeType="positive"
            icon={<DollarIcon className="w-6 h-6" />}
          />
          <MetricCard
            title="Avg Response Time"
            value="234ms"
            change="+5.2% slower"
            changeType="negative"
            icon={<ClockIcon className="w-6 h-6" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <QuickActions />
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SystemHealth />
          <RecentActivity />
        </div>

        {/* Protocol Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <MCPServersWidget />
          <A2AWidget />
          <AP2Widget />
          <SkinsWidget />
        </div>
      </div>
    </div>
  );
}
